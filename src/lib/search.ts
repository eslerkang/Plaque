/**
 * Search utilities for Plaque artwork collection.
 *
 * Features:
 *  - 초성 검색: typing ㅂㄱㅎ matches 박경화
 *  - Exact substring match (case-insensitive)
 *  - Searches all text fields: title, artist, gallery, exhibition, medium, year, note, tags
 *  - Relevance scoring: title > artist > other fields
 */

// ── 초성 (initial consonant) constants ────────────────────────────────────

/** Unicode offset for the start of Korean syllable block (가) */
const KO_SYLLABLE_START = 0xac00;
/** Syllables per initial consonant (21 vowels × 28 final consonants) */
const KO_BLOCK = 21 * 28;

/** Initial consonants in Unicode syllable-ordering index */
const CHOSUNG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
  "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;

/** Unicode range for standalone 초성 glyphs (ㄱ ~ ㅎ = U+3131 ~ U+314E) */
const CHOSUNG_RANGE_START = 0x3131;
const CHOSUNG_RANGE_END = 0x314E;

function isStandaloneChosung(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return c >= CHOSUNG_RANGE_START && c <= CHOSUNG_RANGE_END;
}

/** True when every character in `q` is a standalone 초성 or space */
function isPureChosungQuery(q: string): boolean {
  return q.length > 0 && Array.from(q).every((c) => isStandaloneChosung(c) || c === " ");
}

/** Extract the 초성 from a single Korean syllable; return the char as-is otherwise */
function extractChosung(ch: string): string {
  const code = ch.charCodeAt(0);
  if (code >= KO_SYLLABLE_START && code <= 0xd7a3) {
    return CHOSUNG[Math.floor((code - KO_SYLLABLE_START) / KO_BLOCK)];
  }
  return ch;
}

/** Convert `text` to a string of its initial consonants */
export function toChosungString(text: string): string {
  return Array.from(text).map(extractChosung).join("");
}

// ── Core match function ────────────────────────────────────────────────────

/**
 * Return true if `text` matches `query` using:
 *  1. Case-insensitive direct substring match
 *  2. 초성 match when the query consists entirely of standalone 초성 characters
 *
 * @example
 *   matchesQuery("빈센트 반 고흐", "반고")   // true  (direct)
 *   matchesQuery("빈센트 반 고흐", "ㅂㄱㅎ") // true  (초성)
 *   matchesQuery("claude monet", "monet")     // true  (direct)
 *   matchesQuery("유화", "ㅇ")               // true  (초성)
 */
export function matchesQuery(text: string, query: string): boolean {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;

  // 1. Direct substring
  if (t.includes(q)) return true;

  // 2. Pure 초성 query
  if (isPureChosungQuery(q)) {
    return toChosungString(t).includes(q);
  }

  return false;
}

// ── Field extraction ────────────────────────────────────────────────────────

type SearchableArtwork = {
  title: string;
  artist_name?: string | null;
  gallery_name?: string | null;
  exhibition_title?: string | null;
  medium?: string | null;
  year?: string | null;
  personal_note?: string | null;
  tags?: string[] | null;
};

/** Concatenated string of all searchable fields */
export function artworkSearchText(a: SearchableArtwork): string {
  return [
    a.title,
    a.artist_name,
    a.gallery_name,
    a.exhibition_title,
    a.medium,
    a.year,
    a.personal_note,
    a.tags?.join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

// ── Relevance scoring ──────────────────────────────────────────────────────

/**
 * Relevance score for sorting results.
 * Higher = more relevant.
 *
 * 3 — title match
 * 2 — artist name match
 * 1 — tag match
 * 0 — any other field match
 */
export function scoreArtwork(a: SearchableArtwork, query: string): number {
  if (!query) return 0;
  if (matchesQuery(a.title, query)) return 3;
  if (a.artist_name && matchesQuery(a.artist_name, query)) return 2;
  if (a.tags?.some((t) => matchesQuery(t, query))) return 1;
  return 0;
}
