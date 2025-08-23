// components/ConfirmModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
}

export function ConfirmModal({
  title = "Konfirmasi",
  description = "Apakah Anda yakin ingin melanjutkan?",
  onConfirm,
  trigger,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button  onClick={handleConfirm}>
            Ya, lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
