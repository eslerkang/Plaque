import Link from "next/link";
import Image from "next/image";
import { type ArtworkWithUrls } from "@/lib/types";
import { StarRating } from "@/components/StarRating";
import { formatDateShort } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: ArtworkWithUrls;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link href={`/scrapbook/${artwork.id}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={artwork.displayUrl}
            alt={artwork.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Catalog info */}
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
            {artwork.title}
          </h3>
          {artwork.artist_name && (
            <p className="text-xs text-muted-foreground">{artwork.artist_name}</p>
          )}
          {artwork.gallery_name && (
            <p className="text-xs text-muted-foreground/70 truncate">
              {artwork.gallery_name}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            {artwork.rating && (
              <StarRating value={artwork.rating} readonly size="sm" />
            )}
            {artwork.visit_date && (
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDateShort(artwork.visit_date)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
