'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'sonner';
import { ImagePlus, Edit, Trash2, MoreHorizontal, Home } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BannerImage {
  url: string;
  publicId: string;
}

interface Banner {
  id: string;
  description: string;
  bannerImages: BannerImage[];
}

const truncateDescription = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};


export default function BannerAdminPage() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchBanners = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/banners');
      if (!res.ok) throw new Error('Gagal mengambil data banner.');
      const data: Banner[] = await res.json();
      setBanners(data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan.'));
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBannerId(banner.id);
    setDescription(banner.description);
    if (banner.bannerImages.length > 0) {
      setImagePreview(banner.bannerImages[0].url);
      setSelectedImage(null);
    } else {
      setImagePreview(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingBannerId(null);
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedImage && !editingBannerId) {
      toast.error('Harap pilih gambar untuk banner.');
      setIsSubmitting(false);
      return;
    }

    try {
      let bannerImageUrl: BannerImage | undefined;
      let existingPublicId: string | undefined;
      
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        formData.append('folder', 'Imagelubna/banners');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        if (!res.ok) throw new Error('Gagal mengunggah gambar.');
        const result = await res.json();
        bannerImageUrl = {
          url: result.secure_url,
          publicId: result.public_id,
        };

        // Ambil publicId lama jika sedang mengedit
        if (editingBannerId && banners) {
            const currentBanner = banners.find(b => b.id === editingBannerId);
            existingPublicId = currentBanner?.bannerImages?.[0]?.publicId;
        }
      }

      // Logika untuk menambah atau mengedit
      const apiEndpoint = editingBannerId ? `/api/banners/${editingBannerId}` : '/api/banners';
      const method = editingBannerId ? 'PATCH' : 'POST';
      const body = {
        description,
        image: bannerImageUrl, // Kirim objek gambar baru
        existingPublicId, // Kirim publicId lama jika ada
      };

      const res = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Gagal ${editingBannerId ? 'memperbarui' : 'menambahkan'} banner.`);
      }

      toast.success(`Banner berhasil ${editingBannerId ? 'diperbarui' : 'ditambahkan'}!`);
      handleCancelEdit();
      fetchBanners();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus banner.');
      }
      toast.success('Banner berhasil dihapus!');
      fetchBanners();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus banner.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      {/* HEADER DAN FORM */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Manajemen Banner
        </h1>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="hover:bg-orange-500 hover:text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {editingBannerId ? 'Edit Banner' : 'Tambah Banner Baru'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image" className="cursor-pointer">
                <div className="border-2 overflow-hidden border-dashed relative w-30 h-30 items-center justify-center flex flex-col">
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
                            sizes="100vw"
                            className="object-cover rounded-md"
                        />
                    ) : (
                        <div className="flex px-2 items-center gap-2 h-30 w-30">
                            <ImagePlus className="h-10 w-10 text-gray-500" />
                            <span className="text-gray-500 text-xs">Pilih Gambar Banner</span>
                        </div>
                    )}
                </div>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {editingBannerId && !selectedImage && imagePreview && (
                <p className="text-sm text-gray-500 mt-2">
                  * Biarkan kosong jika tidak ingin mengubah gambar.
                  
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description mt-2 ">Deskripsi Banner</Label>
              <p className="text-sm text-gray-500 text-right mt-2">
                {description.length} / 125
              </p>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                maxLength={125}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {editingBannerId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Batal Edit
                </Button>
              )}
              <Button
                type="submit"
                className="bg-gradient-to-r from-black to-green-300 text-white hover:from-green-300 hover:to-black transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Memproses...'
                  : editingBannerId
                  ? 'Perbarui Banner'
                  : 'Tambah Banner'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* DAFTAR BANNER */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Memuat banner...
            </p>
          ) : isError ? (
            <p className="text-center text-red-600 dark:text-red-400 py-8">
              Error: {error?.message}
            </p>
          ) : banners && banners.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Belum ada banner. Tambahkan banner pertama Anda!
            </p>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {banners?.map((banner) => (
                <Card key={banner.id} className="shadow-md bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Image
                      src={banner.bannerImages?.[0]?.url || "https://via.placeholder.com/100x100?text=No+Image"}
                      alt={banner.description || 'Banner image'}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow overflow-hidden">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {truncateDescription(banner.description, 85)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {banner.id}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(banner)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini akan menghapus banner ini secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Gambar</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners?.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <Image
                          src={banner.bannerImages?.[0]?.url || "https://via.placeholder.com/100x100?text=No+Image"}
                          alt={banner.description || 'Banner image'}
                          width={96}
                          height={64}
                          className="w-24 h-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {truncateDescription(banner.description, 85)}
                      </TableCell>
                      <TableCell>{banner.id}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini akan menghapus banner ini secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}