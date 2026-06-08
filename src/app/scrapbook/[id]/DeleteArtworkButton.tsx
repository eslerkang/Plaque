"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { BUCKET } from "@/lib/supabase/storage";

export function DeleteArtworkButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    const supabase = createClient();

    // 1. Fetch paths before deleting the row (so we can clean up storage)
    const { data: artwork } = await supabase
      .from("artwork_entries")
      .select("original_image_path, cleaned_image_path")
      .eq("id", id)
      .single();

    // 2. Delete the DB row (RLS ensures only owner can delete)
    const { error: deleteError } = await supabase
      .from("artwork_entries")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setDeleting(false);
      return;
    }

    // 3. Best-effort: delete storage files (non-blocking — row already deleted)
    if (artwork) {
      const paths = [
        artwork.original_image_path,
        artwork.cleaned_image_path,
      ].filter(Boolean) as string[];

      if (paths.length > 0) {
        // Fire-and-forget — storage cleanup failure is not user-visible
        supabase.storage.from(BUCKET).remove(paths).catch(() => {});
      }
    }

    router.push("/scrapbook");
    router.refresh();
  }

  return (
    <>
      <Button
        variant="outline"
        className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={() => { setOpen(true); setError(null); }}
      >
        <Trash2 className="h-4 w-4" />
        삭제
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setError(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>작품 삭제</DialogTitle>
            <DialogDescription>
              이 작품 기록을 삭제할까요? 삭제 후에는 복구할 수 없어요.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "삭제"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
