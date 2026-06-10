"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/LocaleProvider";

interface StarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const { t } = useTranslation();
  const iconSize = sizeMap[size];

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && value >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            className={cn(
              "transition-transform",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            aria-label={t("common.points", { n: star })}
          >
            <Star
              className={cn(
                iconSize,
                filled
                  ? "fill-accent stroke-accent"
                  : "fill-none stroke-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
