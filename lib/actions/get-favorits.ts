"use server";

import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductTransformed } from "./product";
import { cache } from "react";

export const getFavorites = cache(async (): Promise<ProductTransformed[]> => {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== "USER") {
    return [];
  }
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            images: true,
            favorites: {
              select: { id: true },
            },
            reviews: {
              include: { images: true }
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const products = favorites.map(fav => fav.product);
    const productIds = products.map(p => p.id);
    const avgRatings = await prisma.review.groupBy({
      by: ['productId'],
      _avg: { rating: true },
      where: {
        productId: { in: productIds }
      }
    });

    const favoriteProductsTransformed = products.map(product => {
      const avg = avgRatings.find(r => r.productId === product.id)?._avg.rating || 0;
      return {
        ...product,
        createdAt: product.createdAt.toISOString(),
        avgRating: avg,
      };
    });

    return favoriteProductsTransformed as ProductTransformed[];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error("Terjadi kesalahan saat mengambil data favorit.");
  }
});