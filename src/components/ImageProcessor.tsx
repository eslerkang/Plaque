"use client";

import {
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

// ── OpenCV type shim ──────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cv: any;
    Module: { onRuntimeInitialized: () => void };
  }
}

export interface ProcessedImages {
  originalDataUrl: string;
  cleanedDataUrl: string | null;
  confidence: "high" | "low" | "failed";
}

export interface ImageProcessorHandle {
  processFile: (file: File) => Promise<ProcessedImages>;
}

interface ImageProcessorProps {
  onProcessed?: (result: ProcessedImages) => void;
}

// ── Load OpenCV.js with timeout ───────────────────────────────────────────────
let cvLoadPromise: Promise<void> | null = null;

function loadOpenCV(): Promise<void> {
  if (cvLoadPromise) return cvLoadPromise;

  cvLoadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") { resolve(); return; }
    if (window.cv && window.cv.Mat) { resolve(); return; }

    // 15-second timeout — mobile WASM can be slow
    const timer = setTimeout(() => {
      reject(new Error("OpenCV load timeout"));
    }, 15000);

    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.8.0/opencv.js";
    script.async = true;
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("OpenCV script load failed"));
    };
    script.onload = () => {
      if (window.cv && window.cv.Mat) {
        clearTimeout(timer);
        resolve();
        return;
      }
      const prev = (window.Module || {}).onRuntimeInitialized;
      window.Module = window.Module || {};
      window.Module.onRuntimeInitialized = () => {
        clearTimeout(timer);
        prev?.();
        resolve();
      };
    };
    document.head.appendChild(script);
  });

  // Reset on failure so next attempt can retry
  cvLoadPromise.catch(() => { cvLoadPromise = null; });
  return cvLoadPromise;
}

// ── Perspective correction ────────────────────────────────────────────────────
function perspectiveCorrect(
  src: HTMLCanvasElement
): { canvas: HTMLCanvasElement; confidence: "high" | "low" | "failed" } {
  const cv = window.cv;
  const srcMat = cv.imread(src);
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.cvtColor(srcMat, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edges, 50, 150);

    const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.dilate(edges, edges, kernel);
    kernel.delete();

    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const imgArea = srcMat.rows * srcMat.cols;
    let bestQuad: number[][] | null = null;
    let bestArea = 0;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      if (area < imgArea * 0.05) continue;

      const peri = cv.arcLength(cnt, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

      if (approx.rows === 4 && area > bestArea && area < imgArea * 0.97) {
        bestArea = area;
        bestQuad = [];
        for (let r = 0; r < 4; r++) {
          bestQuad.push([approx.intAt(r, 0), approx.intAt(r, 1)]);
        }
      }
      approx.delete();
    }

    if (!bestQuad) return { canvas: src, confidence: "failed" };

    const confidence: "high" | "low" = bestArea / imgArea > 0.2 ? "high" : "low";
    const sorted = orderCorners(bestQuad);
    const [tl, tr, br, bl] = sorted;

    const width = Math.max(
      Math.hypot(br[0] - bl[0], br[1] - bl[1]),
      Math.hypot(tr[0] - tl[0], tr[1] - tl[1])
    );
    const height = Math.max(
      Math.hypot(tr[0] - br[0], tr[1] - br[1]),
      Math.hypot(tl[0] - bl[0], tl[1] - bl[1])
    );

    const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
      tl[0], tl[1], tr[0], tr[1], br[0], br[1], bl[0], bl[1],
    ]);
    const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0, width, 0, width, height, 0, height,
    ]);

    const M = cv.getPerspectiveTransform(srcPts, dstPts);
    const dst = new cv.Mat();
    const dsize = new cv.Size(Math.round(width), Math.round(height));
    cv.warpPerspective(srcMat, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT);

    const outCanvas = document.createElement("canvas");
    outCanvas.width = Math.round(width);
    outCanvas.height = Math.round(height);
    cv.imshow(outCanvas, dst);

    srcPts.delete(); dstPts.delete(); M.delete(); dst.delete();
    return { canvas: outCanvas, confidence };
  } finally {
    srcMat.delete(); gray.delete(); blurred.delete();
    edges.delete(); contours.delete(); hierarchy.delete();
  }
}

function orderCorners(pts: number[][]): number[][] {
  const center = pts.reduce(
    (acc, p) => [acc[0] + p[0] / 4, acc[1] + p[1] / 4],
    [0, 0]
  );
  const [cx, cy] = center;
  const tl = pts.filter((p) => p[0] < cx && p[1] < cy)[0] || pts[0];
  const tr = pts.filter((p) => p[0] >= cx && p[1] < cy)[0] || pts[1];
  const br = pts.filter((p) => p[0] >= cx && p[1] >= cy)[0] || pts[2];
  const bl = pts.filter((p) => p[0] < cx && p[1] >= cy)[0] || pts[3];
  return [tl, tr, br, bl];
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ImageProcessor = forwardRef<ImageProcessorHandle, ImageProcessorProps>(
  function ImageProcessor({ onProcessed }, ref) {
    useEffect(() => {
      // Warm up OpenCV in background (ignore failure — processFile handles it)
      loadOpenCV().catch(() => {});
    }, []);

    const processFile = useCallback(async (file: File): Promise<ProcessedImages> => {
      // ── 1. Decode image ──────────────────────────────────────────────────────
      const rawDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new window.Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = rawDataUrl;
      });

      // ── 2. Compress original (max 2048px, JPEG 0.88) ─────────────────────────
      // Keeps file size ~1-3 MB regardless of source camera resolution
      const MAX_ORIGINAL = 2048;
      const origScale = Math.min(1, MAX_ORIGINAL / Math.max(img.width, img.height));
      const origCanvas = document.createElement("canvas");
      origCanvas.width = Math.round(img.width * origScale);
      origCanvas.height = Math.round(img.height * origScale);
      origCanvas.getContext("2d")!.drawImage(img, 0, 0, origCanvas.width, origCanvas.height);
      const originalDataUrl = origCanvas.toDataURL("image/jpeg", 0.88);

      // ── 3. OpenCV on a smaller canvas for speed (max 1600px) ────────────────
      const MAX_CV = 1600;
      const cvScale = Math.min(1, MAX_CV / Math.max(img.width, img.height));
      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = Math.round(img.width * cvScale);
      srcCanvas.height = Math.round(img.height * cvScale);
      srcCanvas.getContext("2d")!.drawImage(img, 0, 0, srcCanvas.width, srcCanvas.height);

      let cleanedDataUrl: string | null = null;
      let confidence: ProcessedImages["confidence"] = "failed";

      try {
        await loadOpenCV();
        const { canvas: out, confidence: conf } = perspectiveCorrect(srcCanvas);
        confidence = conf;
        if (conf !== "failed") {
          // Scale cleaned output up to match original quality
          cleanedDataUrl = out.toDataURL("image/jpeg", 0.90);
        }
      } catch {
        confidence = "failed";
      }

      const result: ProcessedImages = { originalDataUrl, cleanedDataUrl, confidence };
      onProcessed?.(result);
      return result;
    }, [onProcessed]);

    useImperativeHandle(ref, () => ({ processFile }), [processFile]);

    // Renders nothing — purely imperative
    return null;
  }
);
