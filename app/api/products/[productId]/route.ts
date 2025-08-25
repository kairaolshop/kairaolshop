// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import  cloudinary from '@/lib/cloudinary';
import slugify from 'slugify';

interface ImageData{
  url: string;
  publicId: string;
  order?: number;
}

interface Context {
  params:Promise< { productId: string }>;
}

export async function GET(req: NextRequest, { params }: Context) { 
  const { productId } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId},
      include: {
        images:{
          select:{ id: true, url: true, publicId: true, order: true},
          orderBy: { order: 'asc'}
        } ,
        category: true,
        reviews:{
          include:{
            images:true,
          }
        }
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    console.log('hilang:',productId)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Context)  {
  try {
    const { productId } =await params;
    const { name, description, price, discountPrice, images, deletedImagePublicIds } = await req.json();
    
    if (!name || !description || !price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    
   const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findFirst({ where: { slug, NOT: {id: productId } } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    
    const imagesToKeep = images.filter((img: { publicId: string }) =>
      product.images.some((existing: { publicId: string }) => existing.publicId === img.publicId)
    );
    const imagesToCreate = images.filter((img: { publicId: string }) =>
      !product.images.some((existing: { publicId: string }) => existing.publicId === img.publicId)
    );
    if (deletedImagePublicIds && deletedImagePublicIds.length > 0) {
      const deletePromises = deletedImagePublicIds.map((publicId: string) =>

        cloudinary.uploader.destroy(publicId)
      );
      await Promise.allSettled(deletePromises);
    }
    
    
    // Perbarui produk dan gambar
    const updatedProduct = await prisma.product.update({
  where: { id: productId },
  data: {
    name,
    slug,
    description,
    price,
    discountPrice,
    images: {
      deleteMany: {
            publicId: {
              in: deletedImagePublicIds
            }
          },
          create: imagesToCreate.map((img: ImageData, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order !== undefined ? img.order : index + imagesToKeep.length, // [CHANGE] Gunakan order dari DND atau fallback ke indeks
          })),
          // [CHANGE] Update order untuk gambar yang tetap berdasarkan posisi di images
          updateMany: imagesToKeep.map((img: ImageData) => ({
            where: { publicId: img.publicId, productId },
            data: { order: img.order !== undefined ? img.order : images.findIndex((i: ImageData) => i.publicId === img.publicId) },
          })),
        },
      },
  include: {
    images: {
      select: { id: true, url: true, publicId: true, order: true },
      orderBy: { order: 'asc' },
    },
  },
});
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Context) {
  try {
    const { productId } = await params;

    const productToDelete = await prisma.product.findUnique({
      where: { id: productId  },
      include: {
        images: true,
        reviews: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!productToDelete) {
      return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    const productPublicIds = productToDelete.images
      .filter(image => image.publicId)
      .map(image => image.publicId);
      
    const reviewImagePublicIds = productToDelete.reviews.flatMap(review =>
      review.images
        .filter(image => image.publicId)
        .map(image => image.publicId)
    );

    const allPublicIds = [...productPublicIds, ...reviewImagePublicIds];
    
    // Kirim semua permintaan penghapusan ke Cloudinary secara paralel
    if (allPublicIds.length > 0) {
      const deletePromises = allPublicIds.map(publicId => cloudinary.uploader.destroy(publicId));
      const results = await Promise.allSettled(deletePromises);
      
      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error(`Gagal menghapus beberapa gambar di Cloudinary:`, (result as PromiseRejectedResult).reason);
        }
      });
    }
    await prisma.product.delete({
      where: { id: productId },
    });

    console.log(`Prisma: Produk ${productId} dan data terkait berhasil dihapus dari DB.`);
    return NextResponse.json({ message: 'Produk, ulasan, dan semua gambar berhasil dihapus.' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting product and images:', error);
    return NextResponse.json({ error: 'Gagal menghapus produk dan gambar.' }, { status: 500 });
  }
}