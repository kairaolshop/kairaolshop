import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';


interface Context {
  params: Promise<{ productId: string; reviewId: string }>;
}
export async function PATCH(req: Request, context: Context) {
  const { productId, reviewId } = await context.params;

  try {
    const { comment, rating, images } = await req.json();

    if (!comment || !rating) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const oldReview = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { images: true },
    });

    if (!oldReview || oldReview.productId !== productId) {
      return NextResponse.json({ message: 'Review not found.' }, { status: 404 });
    }

    const oldPublicIds = oldReview.images.map(img => img.publicId);
    if (oldPublicIds.length > 0) {
      await Promise.allSettled(oldPublicIds.map(publicId => cloudinary.uploader.destroy(publicId)));
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        comment,
        rating,
        images: {
          deleteMany: {},
          createMany: {
            data: images.map((img: { url: string; publicId: string }) => ({
              url: img.url,
              publicId: img.publicId,
            })),
          },
        },
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: Context) {
  const { productId, reviewId } =await context.params;
  try {
    

    const reviewToDelete = await prisma.review.findUnique({
      where: { id:reviewId },
      include: { images: true },
    });

    if (!reviewToDelete || reviewToDelete.productId !== productId)  {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    const publicIds = reviewToDelete.images.map(image => image.publicId);

    await prisma.review.delete({
      where: { id:reviewId },
    });

    if (publicIds.length > 0) {
      await Promise.allSettled(publicIds.map(publicId => cloudinary.uploader.destroy(publicId)));
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { message: 'Failed to delete review' },
      { status: 500 }
    );
  }
}