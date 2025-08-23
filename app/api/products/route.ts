// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import slugify from 'slugify';

// Skema untuk gambar produk (sama seperti di frontend)
 const productImageSchema = z.object({
  url: z.string().url("URL gambar tidak valid."),
  publicId: z.string().min(1, "Public ID diperlukan."),
});

// Skema untuk validasi data POST dari frontend
const productPostSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter."),
  description: z.string().min(10, "Deskripsi produk minimal 10 karakter."),
  price: z.number().int().min(3,"Harga harus angka positif."),
  discountPrice: z.number().int().positive("Harga diskon harus angka positif.").nullable().optional(),
  categoryId: z.string().cuid("ID kategori tidak valid."),
  // Validasi images di backend:
  // Memastikan images adalah array dengan minimal 1 item
  images: z.array(productImageSchema).min(1, "Minimal satu gambar diperlukan."),
});

// Handler untuk mengambil produk (tidak ada perubahan)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true, // Sertakan kategori untuk setiap produk
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Handler untuk menambah produk
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasi data menggunakan skema yang baru
    const validation = productPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Validasi data gagal.', errors: validation.error.format() },
        { status: 400 }
      );
    }
    const { name, description, price, discountPrice, categoryId, images } = validation.data;

    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discountPrice,
        categoryId,
        images: {
          createMany: {
            data: images.map((image, index) => ({
              url: image.url,
              publicId: image.publicId,
              order: index + 1, // Atur urutan gambar
            })),
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Produk berhasil ditambahkan.', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server.', error: error },
      { status: 500 }
    );
  }
}