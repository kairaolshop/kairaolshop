"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // Untuk halaman favorites
    if (pathname.startsWith("/favorites") && !session?.user?.id) {
      toast.error("Silakan login untuk mengakses favorit Anda.");
    }

    // Untuk dashboard
    if (pathname.startsWith("/dashboard") && session?.user?.role !== "ADMIN") {
      toast.error("Akses dashboard hanya untuk Admin.");
    }
  }, [status, session, pathname]);

  return <>{children}</>;
}
