'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginPromptModalProps {
  children: React.ReactNode;
}

export function LoginPromptModal({ children }: LoginPromptModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Modal akan dibuka
      setScrollPosition(window.scrollY);
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen, scrollPosition]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 text-center z-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambahkan ke Favorit
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            Silahkan login terlebih dahulu untuk menyimpan produk ini ke daftar favorit Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleLoginClick}
            className="w-full text-black bg-[radial-gradient(circle,_#f3e0a6,_#fac114)] transition-colors"
          >
            Login / Daftar
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Lewati untuk sekarang
            </Button>
          </DialogClose>
        </div>
        <DialogClose asChild>
          <button className="absolute top-2 right-2 p-1">
            
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}