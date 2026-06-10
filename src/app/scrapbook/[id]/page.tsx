import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { encodeTag, formatDate } from "@/lib/utils";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { AIFeaturePlaceholder } from "@/components/AIFeaturePlaceholder";
import { DeleteArtworkButton } from "./DeleteArtworkButton";
import { withSignedUrls } from "@/lib/supabase/storage";
import type { ArtworkEntry } from "@/lib/types";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";
import { requireUserWithConsent } from "@/lib/auth";

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireUserWithConsent();
  const locale = await getLocale();

  const { data: artwork, error } = await supabase
    .from("artwork_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !artwork) notFound();

  const [entry] = await withSignedUrls([artwork as ArtworkEntry], supabase);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          <Link
            href="/scrapbook"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label={t("detail.back", locale)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold flex-1 truncate">{entry.title}</h1>
          <Link
            href={`/scrapbook/${id}/edit`}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={t("detail.edit", locale)}
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Hero image */}
        <div className="relative w-full aspect-[4/3] bg-muted max-w-lg mx-auto">
          <Image
            src={entry.displayUrl}
            alt={entry.title}
            fill
            className="object-contain"
            preload
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, 512px"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
          {/* Title + artist */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold leading-tight">{entry.title}</h2>
            {entry.artist_name && (
              <p className="text-base text-muted-foreground">{entry.artist_name}</p>
            )}
          </div>

          {/* Rating */}
          {entry.rating && (
            <StarRating value={entry.rating} readonly size="md" />
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Catalog metadata */}
          <dl className="space-y-3">
            {entry.year && (
              <div className="flex gap-4">
                <dt className="text-sm text-muted-foreground w-20 shrink-0">{t("detail.year", locale)}</dt>
                <dd className="text-sm">{entry.year}</dd>
              </div>
            )}
            {entry.medium && (
              <div className="flex gap-4">
                <dt className="text-sm text-muted-foreground w-20 shrink-0">{t("detail.medium", locale)}</dt>
                <dd className="text-sm">{entry.medium}</dd>
              </div>
            )}
            {entry.gallery_name && (
              <div className="flex gap-4">
                <dt className="text-sm text-muted-foreground w-20 shrink-0">{t("detail.location", locale)}</dt>
                <dd className="text-sm">{entry.gallery_name}</dd>
              </div>
            )}
            {entry.exhibition_title && (
              <div className="flex gap-4">
                <dt className="text-sm text-muted-foreground w-20 shrink-0">{t("detail.exhibition", locale)}</dt>
                <dd className="text-sm">{entry.exhibition_title}</dd>
              </div>
            )}
            {entry.visit_date && (
              <div className="flex gap-4">
                <dt className="text-sm text-muted-foreground w-20 shrink-0">{t("detail.visitDate", locale)}</dt>
                <dd className="text-sm">{formatDate(entry.visit_date)}</dd>
              </div>
            )}
          </dl>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Link key={tag} href={`/search?tag=${encodeTag(tag)}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-accent/30 transition-colors">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Personal note */}
          {entry.personal_note && (
            <div className="rounded-lg bg-muted/60 p-4 border-l-2 border-accent">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {entry.personal_note}
              </p>
            </div>
          )}

          {/* Original image toggle — only shown when cleaned is selected */}
          {entry.cleanedUrl && entry.selected_image_type === "cleaned" && (
            <details className="group">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground list-none flex items-center gap-1">
                <span className="group-open:hidden">{t("detail.showOriginal", locale)}</span>
                <span className="hidden group-open:inline">{t("detail.hideOriginal", locale)}</span>
              </summary>
              <div className="mt-3 relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={entry.originalUrl}
                  alt="원본 이미지"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </details>
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* AI Feature Placeholders */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {t("detail.aiSection", locale)}
            </p>
            <div className="flex flex-wrap gap-2">
              <AIFeaturePlaceholder label={t("ai.explain", locale)} />
              <AIFeaturePlaceholder label={t("ai.context", locale)} />
              <AIFeaturePlaceholder label={t("ai.similar", locale)} />
              <AIFeaturePlaceholder label={t("ai.taste", locale)} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1 gap-2">
              <Link href={`/scrapbook/${id}/edit`}>
                <Pencil className="h-4 w-4" />
                {t("detail.edit", locale)}
              </Link>
            </Button>
            <DeleteArtworkButton id={id} />
          </div>
        </div>
      </main>

    </div>
  );
}
