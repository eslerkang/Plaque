"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { TagInput } from "@/components/TagInput";
import { ImageProcessor } from "@/components/ImageProcessor";
import type { ProcessedImages, ImageProcessorHandle } from "@/components/ImageProcessor";
import {
  ArrowLeft,
  Camera,
  ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";

type Step = "upload" | "review" | "metadata";

interface FormData {
  title: string;
  artist_name: string;
  year: string;
  medium: string;
  gallery_name: string;
  exhibition_title: string;
  visit_date: string;
  personal_note: string;
  rating: number | null;
  tags: string[];
}

const INITIAL_FORM: FormData = {
  title: "",
  artist_name: "",
  year: "",
  medium: "",
  gallery_name: "",
  exhibition_title: "",
  visit_date: "",
  personal_note: "",
  rating: null,
  tags: [],
};

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
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
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
    if (!form.title.trim()) { setError(t("field.title.error")); return; }
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

      const tags = form.tags;

      const { data, error: insertError } = await supabase
        .from("artwork_entries")
        .insert({
          user_id: userId,
          original_image_path: originalPath,
          cleaned_image_path: cleanedPath,
          selected_image_type: selectedType,
          title: form.title.trim(),
          artist_name: form.artist_name.trim() || null,
          year: form.year.trim() || null,
          medium: form.medium.trim() || null,
          gallery_name: form.gallery_name.trim() || null,
          exhibition_title: form.exhibition_title.trim() || null,
          visit_date: form.visit_date || null,
          personal_note: form.personal_note.trim() || null,
          rating: form.rating,
          tags: tags.length > 0 ? tags : null,
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

  function updateForm(key: keyof FormData, value: string | number | null | string[]) {
    setForm((f) => ({ ...f, [key]: value }));
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

            <div className="space-y-2">
              <Label htmlFor="title">
                {t("field.title")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t("field.title.placeholder")}
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">{t("field.artist")}</Label>
              <Input
                id="artist"
                placeholder={t("field.artist.placeholder")}
                value={form.artist_name}
                onChange={(e) => updateForm("artist_name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="year">{t("field.year")}</Label>
                <Input
                  id="year"
                  placeholder={t("field.year.placeholder")}
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">{t("field.medium")}</Label>
                <Input
                  id="medium"
                  placeholder={t("field.medium.placeholder")}
                  value={form.medium}
                  onChange={(e) => updateForm("medium", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery">{t("field.gallery")}</Label>
              <Input
                id="gallery"
                placeholder={t("field.gallery.placeholder")}
                value={form.gallery_name}
                onChange={(e) => updateForm("gallery_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exhibition">{t("field.exhibition")}</Label>
              <Input
                id="exhibition"
                placeholder={t("field.exhibition.placeholder")}
                value={form.exhibition_title}
                onChange={(e) => updateForm("exhibition_title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit_date">{t("field.visitDate")}</Label>
              <Input
                id="visit_date"
                type="date"
                value={form.visit_date}
                onChange={(e) => updateForm("visit_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("field.rating")}</Label>
              <div className="flex items-center gap-3">
                <StarRating
                  value={form.rating}
                  onChange={(v) => updateForm("rating", v)}
                  size="lg"
                />
                {form.rating && (
                  <button
                    type="button"
                    onClick={() => updateForm("rating", null)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="clear rating"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">{t("field.note")}</Label>
              <Textarea
                id="note"
                placeholder={t("field.note.placeholder")}
                rows={4}
                value={form.personal_note}
                onChange={(e) => updateForm("personal_note", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("field.tags")}</Label>
              <TagInput
                value={form.tags}
                onChange={(tags) => updateForm("tags", tags)}
                suggestions={existingTags}
                placeholder={t("field.tags.placeholder")}
              />
            </div>

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
                disabled={submitting || !form.title.trim()}
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
