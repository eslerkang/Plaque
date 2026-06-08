"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface AIFeaturePlaceholderProps {
  label: string;
}

export function AIFeaturePlaceholder({ label }: AIFeaturePlaceholderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground border-dashed gap-1.5"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>준비 중인 기능입니다</DialogTitle>
            <DialogDescription className="text-center leading-relaxed pt-2">
              향후에는 작품의 배경, 신화·역사적 맥락, 작가의 의도, 관련 작품 등을
              설명해드릴 예정입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setOpen(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
