"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "태그 입력 후 Enter",
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered suggestions: match input, exclude already-added tags
  const filtered = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase().trim()) &&
      !value.includes(s) &&
      inputValue.trim().length > 0
  );

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#/, "");
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInputValue("");
    setOpen(false);
    setHighlighted(-1);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted]) {
        addTag(filtered[highlighted]);
      } else {
        addTag(inputValue);
      }
      return;
    }
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Strip leading comma/space
    const v = e.target.value.replace(/^[,\s]+/, "");
    setInputValue(v);
    setOpen(v.trim().length > 0);
    setHighlighted(-1);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Input area */}
      <div
        className={cn(
          "flex flex-wrap gap-1.5 min-h-10 px-3 py-2 rounded-md border border-input bg-background text-sm",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "cursor-text",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected tags */}
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs font-medium"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${tag} 제거`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* Suggestions dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-md border border-border bg-card shadow-md overflow-hidden">
          {filtered.slice(0, 8).map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                i === highlighted ? "bg-muted" : "hover:bg-muted/50"
              )}
            >
              <span className="text-muted-foreground">#</span>
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="mt-1 text-xs text-muted-foreground">
        Enter 또는 쉼표(,)로 추가 · 최근 태그를 자동으로 제안해요
      </p>
    </div>
  );
}
