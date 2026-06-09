"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ArtworkWithUrls } from "@/lib/types";

interface ExportViewProps {
  artworks: ArtworkWithUrls[];
}

function RatingDots({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: i <= value ? "#1a1917" : "#e3ddd5",
          }}
        />
      ))}
    </span>
  );
}

export function ExportView({ artworks }: ExportViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleDownloadPDF() {
    setIsGenerating(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const element = document.getElementById("export-content");
      if (!element) throw new Error("Export element not found");

      // Wait for all images to fully load
      const images = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  img.onload = () => resolve();
                  img.onerror = () => resolve(); // don't block on failed images
                })
        )
      );

      // Capture the full document at 2× scale for retina quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#faf9f7",
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // A4 in mm
      const PAGE_W_MM = 210;
      const PAGE_H_MM = 297;

      // mm per canvas-pixel (at scale=2, canvas.width = element.scrollWidth * 2)
      const mmPerPx = PAGE_W_MM / canvas.width;
      const totalHeightMm = canvas.height * mmPerPx;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      let remainingMm = totalHeightMm;
      let srcYPx = 0;

      while (remainingMm > 0) {
        const sliceMm = Math.min(PAGE_H_MM, remainingMm);
        const slicePx = Math.round(sliceMm / mmPerPx);

        // Slice the canvas for this page
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = slicePx;
        const ctx = slice.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#faf9f7";
          ctx.fillRect(0, 0, slice.width, slice.height);
          ctx.drawImage(canvas, 0, srcYPx, canvas.width, slicePx, 0, 0, canvas.width, slicePx);
        }

        if (srcYPx > 0) pdf.addPage();
        pdf.addImage(
          slice.toDataURL("image/jpeg", 0.92),
          "JPEG",
          0,
          0,
          PAGE_W_MM,
          sliceMm
        );

        srcYPx += slicePx;
        remainingMm -= sliceMm;
      }

      const filename = `plaque-collection-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback: browser print
      window.print();
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      {/* Top bar (screen only) */}
      <div className="print:hidden sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
          <Link
            href="/scrapbook"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            스크랩북
          </Link>
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            className="gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                PDF로 저장
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Document — captured by html2canvas */}
      <div
        id="export-content"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          backgroundColor: "#faf9f7",
          color: "#1a1917",
          maxWidth: 740,
          margin: "0 auto",
          padding: "40px 48px",
        }}
      >
        {/* Cover */}
        <div style={{ paddingBottom: "3rem", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6b6560",
              marginBottom: "0.5rem",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Personal Archive
          </p>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0 0 0.25rem",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Plaque
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b6560",
              margin: "0 0 1.5rem",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            나만의 미술관 컬렉션
          </p>
          <div style={{ borderBottom: "2px solid #1a1917", marginBottom: "1.5rem" }} />
          <p style={{ fontSize: "0.875rem", color: "#6b6560", margin: 0 }}>
            총 {artworks.length}점의 작품 &nbsp;·&nbsp; {today}
          </p>
        </div>

        {/* Artwork entries */}
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2.5rem",
              padding: "2.5rem 0",
              borderTop: "1px solid #e3ddd5",
            }}
          >
            {/* Image */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artwork.displayUrl}
                alt={artwork.title}
                crossOrigin="anonymous"
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  objectFit: "contain",
                  backgroundColor: "#f0ece6",
                  display: "block",
                }}
              />
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "#6b6560",
                  marginTop: "0.375rem",
                  textAlign: "center",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {index + 1}
              </p>
            </div>

            {/* Metadata */}
            <div style={{ paddingTop: "0.25rem" }}>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  margin: "0 0 0.25rem",
                  lineHeight: 1.3,
                }}
              >
                {artwork.title}
              </h2>

              {artwork.artist_name && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b6560",
                    margin: "0 0 1rem",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}
                >
                  {artwork.artist_name}
                </p>
              )}

              {artwork.rating && (
                <div style={{ marginBottom: "1rem" }}>
                  <RatingDots value={artwork.rating} />
                </div>
              )}

              <dl
                style={{
                  fontSize: "0.75rem",
                  margin: "0 0 0.75rem",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {(
                  [
                    ["제작 연도", artwork.year],
                    ["재료/기법", artwork.medium],
                    ["장소", artwork.gallery_name],
                    ["전시", artwork.exhibition_title],
                    [
                      "방문일",
                      artwork.visit_date ? formatDate(artwork.visit_date) : null,
                    ],
                  ] as [string, string | null | undefined][]
                )
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "0.375rem",
                      }}
                    >
                      <dt style={{ color: "#6b6560", flexShrink: 0, width: "4.5rem" }}>
                        {label}
                      </dt>
                      <dd style={{ margin: 0 }}>{value}</dd>
                    </div>
                  ))}
              </dl>

              {artwork.tags && artwork.tags.length > 0 && (
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6b6560",
                    margin: "0 0 0.75rem",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}
                >
                  {artwork.tags.map((t) => `#${t}`).join("  ")}
                </p>
              )}

              {artwork.personal_note && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    lineHeight: 1.6,
                    borderLeft: "2px solid #c9b99a",
                    paddingLeft: "0.75rem",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {artwork.personal_note}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e3ddd5",
            paddingTop: "1rem",
            marginTop: "2rem",
            fontSize: "0.65rem",
            color: "#6b6560",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <span>Plaque — 나만의 미술관</span>
          <span>{today}</span>
        </div>
      </div>
    </>
  );
}
