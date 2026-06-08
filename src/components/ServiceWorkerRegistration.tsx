"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Check for updates every time the app focuses
        const handleFocus = () => reg.update();
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
      })
      .catch((err) => {
        // SW registration is non-critical — fail silently
        console.warn("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
