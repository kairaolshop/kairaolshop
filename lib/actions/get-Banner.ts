'use server';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';

export type BannerImageTransformed = {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BannerWithImagesTransformed = {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  bannerImages: BannerImageTransformed[];
};

// Gunakan `cache` untuk menyimpan hasil query
export const getBanners = cache(async (): Promise<BannerWithImagesTransformed[]> => {
  try {
    const banners = await prisma.banner.findMany({
      include: {
        bannerImages: {
          select: { id: true, url: true, publicId: true, altText: true, createdAt: true, updatedAt: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return banners.map((banner) => ({
      ...banner,
      createdAt: banner.createdAt.toISOString(),
      updatedAt: banner.updatedAt.toISOString(),
      bannerImages: banner.bannerImages.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        altText: img.altText,
        createdAt: img.createdAt.toISOString(),
        updatedAt: img.updatedAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw new Error('Gagal mengambil data banner.');
  }
});