"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/LocaleProvider";

export type ViewMode = "grid" | "timeline";

export function ScrapbookViewToggle({ current }: { current: ViewMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  function setView(view: ViewMode) {
    const params = new URLSearchParams(searchParams.toString());
    if (view === "grid") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex gap-0.5 p-0.5 rounded-lg border border-border bg-muted/30">
      {(["grid", "timeline"] as ViewMode[]).map((view) => (
        <button
          key={view}
          onClick={() => setView(view)}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            current === view
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={view === "grid" ? t("scrapbook.view.grid") : t("scrapbook.view.timeline")}
        >
          {view === "grid" ? (
            <LayoutGrid className="h-3.5 w-3.5" />
          ) : (
            <List className="h-3.5 w-3.5" />
          )}
        </button>
      ))}
    </div>
  );
}
