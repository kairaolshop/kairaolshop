"use server";

import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== "USER") {
    throw new Error("Unauthorized: Anda harus login sebagai USER.");
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new Error("Produk tidak ditemukan.");
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: productId,
      },
    },
  });

  try {
    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: productId,
          },
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          productId: productId,
        },
      });
    }
    revalidatePath("/favorites", "page");
    revalidatePath(`/products/${product.slug}`, "page");
    
    return { success: true };

  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Gagal mengubah status favorit.");
  }
}

export async function getFavoriteStatus(productId: string) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== "USER") {
    return { isFavorite: false };
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: productId,
      },
    },
  });

  return { isFavorite: !!favorite };
}