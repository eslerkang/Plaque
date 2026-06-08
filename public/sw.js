// Plaque Service Worker
// Strategy:
//   /_next/static/*  → Cache First (immutable, content-hashed)
//   Supabase images  → Stale-While-Revalidate
//   Navigation       → Network First + cache fallback
//   Everything else  → Network First

const CACHE_VERSION = "v1";
const STATIC_CACHE = `plaque-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `plaque-images-${CACHE_VERSION}`;
const PAGE_CACHE = `plaque-pages-${CACHE_VERSION}`;

const STATIC_PRECACHE = ["/", "/offline"];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (k) =>
                ![STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE].includes(k)
            )
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // Next.js static assets — Cache First (immutable)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Supabase storage images — Stale-While-Revalidate
  if (
    url.hostname.includes("supabase.co") &&
    url.pathname.includes("/storage/")
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // Navigation requests (HTML pages) — Network First
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Default — Network First (no cache fallback)
  event.respondWith(networkFirst(request, PAGE_CACHE));
});

// ── Strategies ────────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Network error", { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached ?? (await fetchPromise) ?? new Response("", { status: 503 });
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("Network error", { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Offline fallback
    const offline = await caches.match("/offline");
    return (
      offline ??
      new Response(
        `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>오프라인 — Plaque</title><style>body{font-family:system-ui,sans-serif;background:#faf9f7;color:#1a1917;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:2rem}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#6b6560;font-size:.875rem}</style></head><body><div><h1>오프라인 상태예요</h1><p>인터넷 연결을 확인하고 다시 시도해주세요.</p></div></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      )
    );
  }
}
