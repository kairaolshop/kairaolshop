'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import Link from "next/link";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Store, Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/ui/deletconfirm';

// Skema validasi Zod untuk formulir kategori baru
const newCategoryFormSchema = z.object({
  name: z.string().min(3, { message: 'Nama kategori minimal 3 karakter.' }),
});

// Tipe TypeScript yang otomatis digenerasi dari skema Zod
type NewCategoryFormType = z.infer<typeof newCategoryFormSchema>;

interface Category {
  id: string;
  name: string;
}

export default function KelolaCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewCategoryFormType>({
    resolver: zodResolver(newCategoryFormSchema),
  });

  // Fungsi untuk mengambil data kategori
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data: Category[] = await res.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error('Gagal memuat daftar kategori.');
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: NewCategoryFormType) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambahkan kategori.');
      }

      toast.success('Kategori berhasil ditambahkan!');
      reset();
      fetchCategories(); // Perbarui daftar kategori setelah penambahan
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan yang tidak diketahui.');
      }
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus kategori.');
      }

      toast.success('Kategori berhasil dihapus!');
      fetchCategories(); // Perbarui daftar setelah penghapusan
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan yang tidak diketahui.');
      }
    }
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950'>
    <div className="p-4 flex flex-col lg:max-w-4xl mx-auto sm:p-6 lg:p-8 ">
      {/* Form Tambah Kategori */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Tambah Kategori Baru</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className='mb-2'>Nama Kategori</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-black to-green-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah Kategori'}
            </Button>
          </div>
        </form>
      </div>

      {/* Tabel Kelola Kategori */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Daftar Kategori</h2>
        {isLoading ? (
          <p>Memuat kategori...</p>
        ) : categories.length === 0 ? (
          <p>Belum ada kategori yang ditambahkan.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toast.info('Fitur edit belum diimplementasikan.')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                     <DeleteConfirmationDialog
                        trigger={
                            <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        }
                        onConfirm={() => handleDelete(category.id)}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex text-blue-600 items-center p-8 gap-2">
            <Store className="h-6 w-6 " />
            <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                Kembali ke Dashboard
            </Link>
            </div>
    </div>
    </div>
  );
}