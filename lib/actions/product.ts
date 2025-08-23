/* eslint-disable @typescript-eslint/no-empty-object-type */
"use server";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
export type ProductImage = Prisma.ProductImageGetPayload<{}>;
export type ReviewImage = Prisma.ReviewImageGetPayload<{}>;

export type Review = Prisma.ReviewGetPayload<{
  include: { images: true };
}>;

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
  };
}>;

export type ProductTransformed = Omit<ProductWithDetails, 'createdAt'> & {
  createdAt: string;
  slug: string;
  avgRating: number;
};
export const getProducts = cache(
  async (options?: {
    limit?: number;
    skip?: number;
    orderBy?: 'createdAt' | 'price' | 'name' | 'rating';
    orderDirection?: 'asc' | 'desc';
    search?: string;
    category?: string;
    excludeSlug?: string;
  }): Promise<ProductTransformed[]> => {
    const { limit, skip, orderBy, orderDirection, search, category, excludeSlug } = options || {};

    try {
      const products = await prisma.product.findMany({
        where: {
          isPublished: true,
          NOT: { slug: excludeSlug },
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }),
          ...(category && {
            category: {
              name: {
                equals: category,
                mode: 'insensitive',
              },
            },
          }),
        },
        include: {
          images: true,
          favorites: {
            select: { id: true },
          },
          reviews: {
            include: { images: true },
          },
        },
        orderBy: {
          [orderBy || 'createdAt']: orderDirection || 'desc',
        },
        take: limit,
        skip: skip,
      });

      // Ambil rata-rata rating untuk semua produk yang diambil
      const productIds = products.map(p => p.id);
      const avgRatings = await prisma.review.groupBy({
        by: ['productId'],
        _avg: { rating: true },
        where: { productId: { in: productIds } },
      });

      return products.map((product) => {
        const avg = avgRatings.find(r => r.productId === product.id)?._avg.rating || 0;
        return {
          ...product,
          createdAt: product.createdAt.toISOString(),
          avgRating: avg,
        };
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Gagal mengambil data produk.');
    }
  }
);

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductTransformed | null> => {
    try {
      if (!slug) {
        throw new Error("Slug harus diisi.");
      }

      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          images: true,
          favorites: {
            select: { id: true },
          },
          reviews: {
            include: { images: true },
          },
        },
      });

      if (!product) {
        return null;
      }

      // Ambil rata-rata rating hanya untuk produk ini
      const avgRatings = await prisma.review.aggregate({
        _avg: { rating: true },
        where: { productId: product.id },
      });

      const avg = avgRatings._avg.rating || 0;

      return {
        ...product,
        createdAt: product.createdAt.toISOString(),
        avgRating: avg,
      };
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw new Error('Gagal mengambil produk berdasarkan slug.');
    }
  }
);