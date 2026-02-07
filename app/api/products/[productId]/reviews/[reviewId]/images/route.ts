import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

// Update interface agar sesuai dengan folder structure
interface Context {
  params: Promise<{ 
    productId: string; 
    reviewId: string; 
  }>
}

export async function DELETE(req: Request, { params }: Context) {
  // Ambil reviewId dari params
  const { reviewId } = await params; 
  
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId }, // Gunakan reviewId di sini
      include: { images: true },
    });

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    const publicIds = review.images.map(image => image.publicId);

    // Hapus gambar dari Cloudinary
    if (publicIds.length > 0) {
      await Promise.allSettled(publicIds.map(publicId => cloudinary.uploader.destroy(publicId)));
    }

    // Hapus entri gambar dari database
    await prisma.reviewImage.deleteMany({
      where: { reviewId: reviewId },
    });

    return NextResponse.json({ message: 'All review images deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review images:', error);
    return NextResponse.json(
      { message: 'Failed to delete review images' },
      { status: 500 }
    );
  }
}