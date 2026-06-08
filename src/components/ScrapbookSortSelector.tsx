"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "created_at", label: "최신순" },
  { value: "visit_date", label: "방문일순" },
  { value: "rating", label: "평점순" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function ScrapbookSortSelector({ current }: { current: SortValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSort(value: SortValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "created_at") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex gap-1">
      {SORT_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleSort(value)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
            current === value
              ? "bg-foreground text-primary-foreground border-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
