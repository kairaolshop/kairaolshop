import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import slugify from 'slugify';
const categorySchema = z.object({
  name: z.string().min(3, { message: 'Nama kategori minimal 3 karakter.' }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = categorySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ message: 'Validasi data gagal.', errors: validation.error.format() }, { status: 400 });
    }

    const { name } = validation.data;
    const slug = slugify(name, { lower: true, strict: true });
        const newCategory = await prisma.category.create({
          data: {
            name,
            slug
          }
        });

    return NextResponse.json({ message: 'Kategori berhasil ditambahkan.', category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return NextResponse.json({ message: 'Gagal memuat kategori.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json({ message: 'ID kategori tidak diberikan.' }, { status: 400 });
    }
    
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json({ message: 'Kategori berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    console.error('[CATEGORIES_DELETE]', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}