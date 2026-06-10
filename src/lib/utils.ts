import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = parseDateOnlyAsLocal(date);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = parseDateOnlyAsLocal(date);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function encodeTag(tag: string): string {
  return encodeURIComponent(tag);
}

function parseDateOnlyAsLocal(date: string | Date): Date {
  if (date instanceof Date) return date;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return new Date(date);

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
