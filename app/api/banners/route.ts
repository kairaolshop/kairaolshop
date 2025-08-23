// app/api/banners/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      include: {
        bannerImages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { message: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, image } = body;

    if (!description || !image || !image.url || !image.publicId) {
      return NextResponse.json(
        { message: 'Description and image data are required.' },
        { status: 400 }
      );
    }

    const newBanner = await prisma.banner.create({
      data: {
        description,
        bannerImages: {
          create: {
            url: image.url,
            publicId: image.publicId,
          },
        },
      },
      include: {
        bannerImages: true,
      },
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { message: 'Failed to create banner.' },
      { status: 500 }
    );
  }
}