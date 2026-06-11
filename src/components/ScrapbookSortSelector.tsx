"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/LocaleProvider";

const SORT_OPTIONS = [
  { value: "created_at", labelKey: "scrapbook.sort.newest" },
  { value: "visit_date", labelKey: "scrapbook.sort.visitDate" },
  { value: "rating", labelKey: "scrapbook.sort.rating" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function ScrapbookSortSelector({ current }: { current: SortValue }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  function sortHref(value: SortValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "created_at") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex gap-1">
      {SORT_OPTIONS.map(({ value, labelKey }) => (
        <Link
          key={value}
          href={sortHref(value)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
            current === value
              ? "bg-foreground text-primary-foreground border-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          )}
        >
          {t(labelKey)}
        </Link>
      ))}
    </div>
  );
}
