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
import { useTranslation } from "@/components/LocaleProvider";

interface AIFeaturePlaceholderProps {
  label: string;
}

export function AIFeaturePlaceholder({ label }: AIFeaturePlaceholderProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

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
            <DialogTitle>{t("ai.placeholder.title")}</DialogTitle>
            <DialogDescription className="text-center leading-relaxed pt-2">
              {t("ai.placeholder.body")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("common.confirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
