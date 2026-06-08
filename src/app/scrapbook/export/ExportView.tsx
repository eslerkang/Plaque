"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ArtworkEntry } from "@/lib/types";

interface ExportViewProps {
  artworks: ArtworkEntry[];
}

function RatingDots({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: i <= value ? "#1a1917" : "#e3ddd5",
          }}
        />
      ))}
    </span>
  );
}

export function ExportView({ artworks }: ExportViewProps) {
  useEffect(() => {
    // Small delay so images can load before print dialog
    const timer = setTimeout(() => {}, 500);
    return () => clearTimeout(timer);
  }, []);

  function handlePrint() {
    window.print();
  }

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Screen-only controls */}
      <div className="print:hidden sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
          <Link
            href="/scrapbook"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            스크랩북
          </Link>
          <Button onClick={handlePrint} size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            PDF로 저장
          </Button>
        </div>
      </div>

      {/* Print document */}
      <div
        className="max-w-2xl mx-auto px-6 py-8 print:max-w-none print:px-0 print:py-0"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {/* Cover */}
        <div
          className="print:h-screen print:flex print:flex-col print:justify-between"
          style={{ paddingBottom: "3rem" }}
        >
          <div
            style={{
              borderBottom: "2px solid #1a1917",
              paddingBottom: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b6560",
                marginBottom: "0.5rem",
              }}
            >
              Personal Archive
            </p>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>
              Plaque
            </h1>
            <p style={{ fontSize: "1rem", color: "#6b6560", marginTop: "0.25rem" }}>
              나만의 미술관 컬렉션
            </p>
          </div>

          <div style={{ color: "#6b6560", fontSize: "0.875rem" }}>
            <p>총 {artworks.length}점의 작품</p>
            <p>{today} 기준</p>
          </div>
        </div>

        {/* Artwork entries */}
        <div>
          {artworks.map((artwork, index) => {
            const imgUrl =
              artwork.selected_image_type === "cleaned" && artwork.cleaned_image_url
                ? artwork.cleaned_image_url
                : artwork.original_image_url;

            return (
              <div
                key={artwork.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  padding: "2rem 0",
                  borderTop: "1px solid #e3ddd5",
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                }}
              >
                {/* Image */}
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={artwork.title}
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "contain",
                      backgroundColor: "#f0ece6",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.65rem",
                      color: "#6b6560",
                      marginTop: "0.375rem",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </p>
                </div>

                {/* Metadata */}
                <div style={{ paddingTop: "0.25rem" }}>
                  <h2
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      margin: "0 0 0.25rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {artwork.title}
                  </h2>
                  {artwork.artist_name && (
                    <p style={{ fontSize: "0.875rem", color: "#6b6560", margin: "0 0 1rem" }}>
                      {artwork.artist_name}
                    </p>
                  )}

                  {artwork.rating && (
                    <div style={{ marginBottom: "1rem" }}>
                      <RatingDots value={artwork.rating} />
                    </div>
                  )}

                  <dl style={{ fontSize: "0.75rem", margin: 0 }}>
                    {[
                      ["제작 연도", artwork.year],
                      ["재료/기법", artwork.medium],
                      ["장소", artwork.gallery_name],
                      ["전시", artwork.exhibition_title],
                      ["방문일", artwork.visit_date ? formatDate(artwork.visit_date) : null],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <div
                          key={label as string}
                          style={{
                            display: "flex",
                            gap: "0.75rem",
                            marginBottom: "0.375rem",
                          }}
                        >
                          <dt style={{ color: "#6b6560", flexShrink: 0, width: "4.5rem" }}>
                            {label}
                          </dt>
                          <dd style={{ margin: 0 }}>{value}</dd>
                        </div>
                      ))}
                  </dl>

                  {artwork.tags && artwork.tags.length > 0 && (
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "#6b6560",
                        marginTop: "0.75rem",
                      }}
                    >
                      {artwork.tags.map((t) => `#${t}`).join("  ")}
                    </p>
                  )}

                  {artwork.personal_note && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#1a1917",
                        marginTop: "0.75rem",
                        lineHeight: 1.6,
                        borderLeft: "2px solid #c9b99a",
                        paddingLeft: "0.75rem",
                        fontStyle: "italic",
                      }}
                    >
                      {artwork.personal_note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e3ddd5",
            paddingTop: "1rem",
            marginTop: "2rem",
            fontSize: "0.65rem",
            color: "#6b6560",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Plaque — 나만의 미술관</span>
          <span>{today}</span>
        </div>
      </div>
    </>
  );
}
