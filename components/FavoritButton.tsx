"use client";
import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/toggleFavorited";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginPromptModal } from "@/components/ModalFavorites";

interface FavoriteButtonProps {
  productId: string;
  isInitialFavorite: boolean;
  userRole: "USER" | "ADMIN" | "GUEST"; 
}

export default function FavoriteButton({ productId, isInitialFavorite, userRole }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(isInitialFavorite);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
  }, [userRole]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

   

    if (userRole === "GUEST") {
      console.log("Harusnya menampilkan modal login");
      return;
    }
     
    setIsFavorite(!isFavorite);

    startTransition(async () => {
      try {
        await toggleFavorite(productId);
      } catch (error) {
        setIsFavorite(isInitialFavorite);
        console.error("Error toggling favorite:", error);
        alert("Gagal mengubah status favorit.");
      }
    });
  };
  if (userRole === "ADMIN") {
    return null;
  }

 const button = (
    <Button
     
      onClick={userRole === "USER"? handleToggle : (e) => e.stopPropagation()} 
      variant="ghost" 
      size="sm"
      disabled={isPending}
      className={cn(
        "text-red-500 text-xs flex-shrink-0 ml-auto md:text-sm absolute top-2 right-2 bg-white/50 hover:bg-white/90 rounded-full p-1 hover:text-red-500",
        isFavorite && userRole === "USER" ? "fill-red-500" : ""
      )}
    >
      <Heart className={cn(
        "h-4 w-4 md:h-10 md:w-auto fill ",
        isFavorite && userRole === "USER" ? "fill-red-500" : ""
      )} />Favorits
    </Button>
  );

  if (userRole === "GUEST") {
    return <LoginPromptModal>{button}</LoginPromptModal>;
  }

  return button;
}