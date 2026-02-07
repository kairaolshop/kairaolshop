"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    images: true;
    reviews: {
      include: {
        images: true;
      };
    };
    favorites: {
      select: { id: true };
    };
    category: {
      select:{id:true, name: true, slug:true};
    }
  };
}>;
export type ProductTransformed = Omit<ProductWithDetails, 'createdAt' | 'category'> & {
  createdAt: string;
  avgRating: number;
  reviewCount: number;
   category: {
    id: string;
    name: string;
    slug: string;
  };
};

export async function getCategory() {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug:true }
  });
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductTransformed[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        category: {
          slug: categorySlug
        }
        },
      
      include: {
        images: true,
        reviews:{
          include:{
            images:true,
          }
        },
        favorites: {
          select: { id: true },
        },
        category:{
          select:{id:true, name:true, slug: true},
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const avgRatings = await prisma.review.groupBy({
      by: ['productId'],
      _avg: { rating: true },
      _count: { rating: true },
      where: {
        productId: {
          in: products.map(p => p.id),
        },
      },
    });

   return products.map((product) => {
      const ratingData = avgRatings.find(r => r.productId === product.id);
      const avg = ratingData?._avg.rating || 0;
      const reviewCount = ratingData?._count.rating || 0;
      

      return {
        ...product,
        createdAt: product.createdAt.toISOString(),
        avgRating: avg,
        reviewCount: reviewCount,
        category: {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug
        },
      };
    });

  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Gagal mengambil data produk berdasarkan kategori.");
  }
}