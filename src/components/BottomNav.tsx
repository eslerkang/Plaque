"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PlusCircle, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/LocaleProvider";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/scrapbook", label: t("nav.scrapbook"), icon: BookOpen },
    { href: "/scrapbook/new", label: t("nav.add"), icon: PlusCircle },
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/scrapbook"
              ? pathname === "/scrapbook"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-3 text-xs transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "stroke-foreground" : "stroke-muted-foreground"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={cn("font-medium", isActive && "font-semibold")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
