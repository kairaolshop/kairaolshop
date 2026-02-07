// app/api/products/[id]/reviews/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


interface Context {
  params: Promise<{ productId: string }>;
}

export async function POST(req: Request, { params }: Context) {
  const { productId } =await params;
  try {
    
    const { comment, rating, images } = await req.json();

    if (!comment || !rating) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

     const imageData = Array.isArray(images)
      ? images.map((img: { url: string; publicId: string }) => ({
          url: img.url,
          publicId: img.publicId,
        }))
      : [];
      
    const newReview = await prisma.review.create({
      data: {
        comment,
        rating,
        productId: productId,
        images: {
          createMany: {
            data: imageData,
          },
        },
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { message: 'Failed to create review' },
      { status: 500 }
    );
  }
}
