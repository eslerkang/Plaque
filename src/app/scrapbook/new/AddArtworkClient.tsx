"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArtworkMetadataFields } from "@/components/ArtworkMetadataFields";
import { ImageProcessor } from "@/components/ImageProcessor";
import type { ProcessedImages, ImageProcessorHandle } from "@/components/ImageProcessor";
import {
  EMPTY_ARTWORK_METADATA,
  isMetadataValid,
  metadataToRow,
  type ArtworkMetadata,
} from "@/lib/artwork-metadata";
import {
  ArrowLeft,
  Camera,
  ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";

type Step = "upload" | "review" | "metadata";

export function AddArtworkClient({
  userId,
  existingTags = [],
}: {
  userId: string;
  existingTags?: string[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processorRef = useRef<ImageProcessorHandle>(null);
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState<ProcessedImages | null>(null);
  const [selectedType, setSelectedType] = useState<"original" | "cleaned">("original");
  const [form, setForm] = useState<ArtworkMetadata>(EMPTY_ARTWORK_METADATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Trigger processing AFTER review step renders (fixes ref timing bug) ──────
  useEffect(() => {
    if (step !== "review" || !selectedFile || processed || processing) return;

    const run = async () => {
      setProcessing(true);
      try {
        const result = await processorRef.current!.processFile(selectedFile);
        setProcessed(result);
        setSelectedType(
          result.cleanedDataUrl && result.confidence === "high" ? "cleaned" : "original"
        );
      } catch {
        // Fallback: show original only
        const reader = new FileReader();
        reader.onload = (e) => {
          setProcessed({
            originalDataUrl: e.target?.result as string,
            cleanedDataUrl: null,
            confidence: "failed",
          });
          setSelectedType("original");
        };
        reader.readAsDataURL(selectedFile);
      } finally {
        setProcessing(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── File selection ───────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("add.upload.error"));
      return;
    }
    setSelectedFile(file);
    setProcessed(null);
    setError(null);
    setStep("review");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── Upload to Supabase Storage ───────────────────────────────────────────────
  async function uploadImage(dataUrl: string, suffix: string): Promise<string> {
    const supabase = createClient();
    const blob = await (await fetch(dataUrl)).blob();
    const ext = blob.type === "image/jpeg" ? "jpg" : "png";
    const path = `${userId}/${Date.now()}_${suffix}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("artwork-images")
      .upload(path, blob, { contentType: blob.type, upsert: false });
    if (uploadError) throw uploadError;
    return path;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isMetadataValid(form)) { setError(t("field.title.error")); return; }
    if (!processed) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const originalPath = await uploadImage(processed.originalDataUrl, "original");
      let cleanedPath: string | null = null;
      if (processed.cleanedDataUrl) {
        cleanedPath = await uploadImage(processed.cleanedDataUrl, "cleaned");
      }

      const { data, error: insertError } = await supabase
        .from("artwork_entries")
        .insert({
          user_id: userId,
          original_image_path: originalPath,
          cleaned_image_path: cleanedPath,
          selected_image_type: selectedType,
          ...metadataToRow(form),
        })
        .select("id")
        .single();

      if (insertError) {
        const orphans = [originalPath, cleanedPath].filter(Boolean) as string[];
        supabase.storage.from("artwork-images").remove(orphans).catch(() => {});
        throw insertError;
      }
      router.push(`/scrapbook/${data.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(t("add.metadata.error"));
      setSubmitting(false);
    }
  }

  const stepLabels: Record<Step, string> = {
    upload: t("add.step.upload"),
    review: t("add.step.review"),
    metadata: t("add.step.metadata"),
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      {/* ImageProcessor always mounted so ref is immediately available */}
      <div className="hidden" aria-hidden>
        <ImageProcessor ref={processorRef} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          <button
            onClick={() => {
              if (step === "review") setStep("upload");
              else if (step === "metadata") setStep("review");
              else router.back();
            }}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-base flex-1">{stepLabels[step]}</h1>
          <div className="flex gap-1.5">
            {(["upload", "review", "metadata"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? "w-4 bg-foreground"
                    : i < ["upload", "review", "metadata"].indexOf(step)
                    ? "w-1.5 bg-accent"
                    : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">

        {/* ── Step 1: Upload ── */}
        {step === "upload" && (
          <div className="space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label={t("add.upload.title")}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-4 text-center hover:border-accent transition-colors active:bg-muted"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Camera className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t("add.upload.title")}</p>
                <p className="text-sm text-muted-foreground">{t("add.upload.subtitle")}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                  }
                }}
              >
                <ImageIcon className="h-5 w-5" />
                {t("add.upload.gallery")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "environment");
                    fileInputRef.current.click();
                  }
                }}
              >
                <Camera className="h-5 w-5" />
                {t("add.upload.camera")}
              </Button>
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </div>
        )}

        {/* ── Step 2: Review ── */}
        {step === "review" && (
          <div className="space-y-6">
            {!processed ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("add.review.analyzing")}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (!selectedFile) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setProcessed({
                        originalDataUrl: e.target?.result as string,
                        cleanedDataUrl: null,
                        confidence: "failed",
                      });
                      setSelectedType("original");
                    };
                    reader.readAsDataURL(selectedFile);
                  }}
                >
                  {t("add.review.skipBtn")}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Original */}
                  <div
                    onClick={() => setSelectedType("original")}
                    className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-colors ${
                      selectedType === "original" ? "border-foreground" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                      <input
                        type="radio"
                        id="original"
                        name="imageType"
                        checked={selectedType === "original"}
                        onChange={() => setSelectedType("original")}
                        className="accent-foreground"
                      />
                      <label htmlFor="original" className="text-sm font-medium cursor-pointer">
                        {t("add.review.original")}
                      </label>
                    </div>
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={processed.originalDataUrl}
                        alt={t("add.review.original")}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Cleaned */}
                  {processed.cleanedDataUrl ? (
                    <div
                      onClick={() => setSelectedType("cleaned")}
                      className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-colors ${
                        selectedType === "cleaned" ? "border-foreground" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                        <input
                          type="radio"
                          id="cleaned"
                          name="imageType"
                          checked={selectedType === "cleaned"}
                          onChange={() => setSelectedType("cleaned")}
                          className="accent-foreground"
                        />
                        <label htmlFor="cleaned" className="text-sm font-medium cursor-pointer">
                          {t("add.review.cleaned")}
                          {processed.confidence === "high" && (
                            <span className="ml-2 text-xs text-accent font-normal">
                              {t("add.review.recommended")}
                            </span>
                          )}
                        </label>
                      </div>
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={processed.cleanedDataUrl}
                          alt={t("add.review.cleaned")}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground text-center">
                      {t("add.review.noCorrection")}
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => setStep("metadata")}
                >
                  {t("add.review.next")}
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* ── Step 3: Metadata ── */}
        {step === "metadata" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {processed && (
              <div className="flex gap-3 items-start p-3 rounded-lg bg-muted/50 border border-border">
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                  <Image
                    src={
                      selectedType === "cleaned" && processed.cleanedDataUrl
                        ? processed.cleanedDataUrl
                        : processed.originalDataUrl
                    }
                    alt={t("field.title")}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {selectedType === "cleaned"
                      ? t("add.metadata.cleanedSelected")
                      : t("add.metadata.originalSelected")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="text-xs text-foreground underline underline-offset-2 mt-0.5"
                  >
                    {t("add.metadata.changeImage")}
                  </button>
                </div>
              </div>
            )}

            <ArtworkMetadataFields
              value={form}
              onChange={setForm}
              existingTags={existingTags}
              showPlaceholders
              autoFocusTitle
            />

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <div className="flex gap-3 pt-2 pb-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setStep("review")}
              >
                <ChevronLeft className="h-5 w-5" />
                {t("add.metadata.prev")}
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={submitting || !isMetadataValid(form)}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("add.metadata.saving")}
                  </>
                ) : (
                  t("add.metadata.save")
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
