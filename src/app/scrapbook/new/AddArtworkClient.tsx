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
      setError("이미지 파일만 업로드할 수 있어요.");
      return;
    }
    setSelectedFile(file);
    setProcessed(null);
    setError(null);
    setStep("review");
    // Processing triggered by useEffect above, after render
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
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
    const { data } = supabase.storage.from("artwork-images").getPublicUrl(path);
    return data.publicUrl;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("작품 제목은 필수입니다."); return; }
    if (!processed) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const originalUrl = await uploadImage(processed.originalDataUrl, "original");
      let cleanedUrl: string | null = null;
      if (processed.cleanedDataUrl) {
        cleanedUrl = await uploadImage(processed.cleanedDataUrl, "cleaned");
      }

      const tags = form.tags;

      const { data, error: insertError } = await supabase
        .from("artwork_entries")
        .insert({
          user_id: userId,
          original_image_url: originalUrl,
          cleaned_image_url: cleanedUrl,
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

      if (insertError) throw insertError;
      router.push(`/scrapbook/${data.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setSubmitting(false);
    }
  }

  function updateForm(key: keyof FormData, value: string | number | null | string[]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

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
            aria-label="뒤로"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-base flex-1">
            {step === "upload" && "사진 선택"}
            {step === "review" && "이미지 검토"}
            {step === "metadata" && "작품 정보"}
          </h1>
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
              aria-label="이미지 파일 선택"
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
                <p className="font-medium text-foreground">사진을 선택하세요</p>
                <p className="text-sm text-muted-foreground">
                  카메라로 찍거나 갤러리에서 가져오기
                </p>
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
                갤러리
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
                카메라
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
                  <span>이미지 분석 중...</span>
                </div>
                {/* Skip button — appears immediately so user is never fully stuck */}
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
                  원본으로 바로 계속하기
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
                        원본 이미지
                      </label>
                    </div>
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={processed.originalDataUrl}
                        alt="원본 이미지"
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
                          보정된 이미지
                          {processed.confidence === "high" && (
                            <span className="ml-2 text-xs text-accent font-normal">권장</span>
                          )}
                        </label>
                      </div>
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={processed.cleanedDataUrl}
                          alt="보정된 이미지"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground text-center">
                      작품 경계를 자동으로 찾지 못했어요. 원본 이미지를 사용할게요.
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => setStep("metadata")}
                >
                  다음
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
                    alt="선택된 이미지"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {selectedType === "cleaned" ? "보정된 이미지" : "원본 이미지"} 선택됨
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="text-xs text-foreground underline underline-offset-2 mt-0.5"
                  >
                    변경하기
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">
                작품 제목 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="예: 별이 빛나는 밤"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">작가</Label>
              <Input
                id="artist"
                placeholder="예: 빈센트 반 고흐"
                value={form.artist_name}
                onChange={(e) => updateForm("artist_name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="year">제작 연도</Label>
                <Input
                  id="year"
                  placeholder="예: 1889"
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">재료 / 기법</Label>
                <Input
                  id="medium"
                  placeholder="예: 유화"
                  value={form.medium}
                  onChange={(e) => updateForm("medium", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery">미술관 / 갤러리</Label>
              <Input
                id="gallery"
                placeholder="예: 뉴욕 현대미술관 (MoMA)"
                value={form.gallery_name}
                onChange={(e) => updateForm("gallery_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exhibition">전시명</Label>
              <Input
                id="exhibition"
                placeholder="예: 반 고흐: 별을 향한 여정"
                value={form.exhibition_title}
                onChange={(e) => updateForm("exhibition_title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit_date">방문 날짜</Label>
              <Input
                id="visit_date"
                type="date"
                value={form.visit_date}
                onChange={(e) => updateForm("visit_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>평점</Label>
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
                    aria-label="평점 삭제"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">감상 메모</Label>
              <Textarea
                id="note"
                placeholder="이 작품에 대한 생각이나 느낌을 자유롭게 적어보세요..."
                rows={4}
                value={form.personal_note}
                onChange={(e) => updateForm("personal_note", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>태그</Label>
              <TagInput
                value={form.tags}
                onChange={(tags) => updateForm("tags", tags)}
                suggestions={existingTags}
                placeholder="예: 인상주의, 풍경화"
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
                이전
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
                    저장 중...
                  </>
                ) : (
                  "스크랩북에 저장"
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
