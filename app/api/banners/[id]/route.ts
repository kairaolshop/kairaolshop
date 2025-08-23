// app/api/banners/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

interface Context {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Context) {
  const { id } =await params;
  try {
    
    const body = await req.json();
    const { description, image, existingPublicId } = body;

    // Ambil banner yang akan diperbarui untuk verifikasi
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { message: 'Banner not found.' },
        { status: 404 }
      );
    }
    if (image && image.publicId) {
      if (existingPublicId) {
        try {
          await cloudinary.uploader.destroy(existingPublicId);
        } catch (cloudinaryErr) {
          console.error(`Cloudinary: Failed to delete old image ${existingPublicId}:`, cloudinaryErr);
        }
      }

      // Perbarui banner dan gambar baru
      await prisma.banner.update({
        where: { id },
        data: {
          description,
          bannerImages: {
            deleteMany: {}, // Hapus semua gambar lama
            create: {
              url: image.url,
              publicId: image.publicId,
            },
          },
        },
      });

    } else {
      await prisma.banner.update({
        where: { id },
        data: { description },
      });
    }

    return NextResponse.json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { message: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Context) {
  const { id } =await params;
  try {
    const bannerToDelete = await prisma.banner.findUnique({
      where: { id },
      include: {
        bannerImages: true,
      },
    });

    if (!bannerToDelete) {
      return NextResponse.json({ message: 'Banner not found.' }, { status: 404 });
    }
    const publicIds = bannerToDelete.bannerImages.map(image => image.publicId);

    await prisma.banner.delete({
      where: { id },
    });
    if (publicIds.length > 0) {
      const deletePromises = publicIds.map(publicId =>
        cloudinary.uploader.destroy(publicId)
      );
      await Promise.allSettled(deletePromises);
    }

    return NextResponse.json({ message: 'Banner and its images deleted successfully.' });
  } catch (error) {
    console.error('Error deleting banner and images:', error);
    return NextResponse.json(
      { message: 'Failed to delete banner and images.' },
      { status: 500 }
    );
  }
}