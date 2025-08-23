'use client';

import z from "zod";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Trash, PlusCircle, ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadImageToCloudinary } from '@/lib/utils/cloudynary';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AlertDialogFooter } from "@/components/ui/AlertDialog";
import Link from "next/link";

interface ReviewImage {
  id: string;
  url: string;
  publicId: string;
  file?: File;
}

interface ReviewFormValues {
  comment: string;
  rating: number;
  images?: ReviewImage[];
}

interface ReviewFormProps {
  initialData: ReviewFormValues & { id?: string } | null;
  productId: string;
}

const reviewSchema = z.object({
  comment: z.string().min(1, 'Ulasan tidak boleh kosong.'),
  rating: z.number().min(1, 'Rating harus antara 1-5.').max(5, 'Rating harus antara 1-5.'),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      publicId: z.string(),
      file: z.instanceof(File).optional(),
    })
  ).optional(),
});

const ReviewForm: React.FC<ReviewFormProps> = ({ initialData, productId }) => {
  if (initialData && !initialData.id) {
    console.warn('Mode edit detected but initialData.id is missing. This will create a new review instead of updating.');
    toast.error('ID ulasan tidak ditemukan. Tidak dapat memperbarui ulasan.');
  }
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const validatedInitialImages = initialData?.images?.map((img) => ({
    id: img.id || `temp-${Date.now()}-${Math.random()}`,
    url: img.url,
    publicId: img.publicId || '',
    file: img.file,
  })) || [];
  const [imagePreviews, setImagePreviews] = useState<ReviewImage[]>(validatedInitialImages);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialData || {
      comment: '',
      rating: 0,
      images: [],
    },
  });
  
  useEffect(() => {
    form.setValue('images', imagePreviews, { shouldValidate: true });
  }, [imagePreviews, form]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [imagePreviews]);

  const resetFormState = useCallback(() => {
  console.log('Resetting form state');
  form.reset();
  setImageFiles([]);
  imagePreviews.forEach((img) => {
    if (img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url);
    }
  });
  setImagePreviews(initialData?.images || []);
  router.refresh();
  router.push(`/dashboard/${productId}/reviews`);
}, [form, imagePreviews, initialData, router, productId]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange called');
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const previews = newFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        publicId: '',
        file,
      }));
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  }, []);

  const handleRemoveImage = useCallback( (index: number) => {
    setImagePreviews((prev) => {
      const updated = [...prev];
      const removedImage = updated[index];
      if (removedImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(removedImage.url);
      }
      updated.splice(index, 1);
      return updated;
    });
    setImageFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  },[]);

  const handleDeleteAllImages = async () => {
    if (!initialData?.id) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/review/${initialData.id}/images`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus semua gambar ulasan.');
      }
      toast.success('Semua gambar ulasan berhasil dihapus!');
      setImagePreviews([]);
      setImageFiles([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const createReviewAction = async (productId: string, data: ReviewFormValues) => {
    const uploadedImages = await Promise.all(
      imageFiles.map((file) => uploadImageToCloudinary(file, 'Imagelubna/reviews'))
    );

    const response = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Product-Id': productId,
      },
      body: JSON.stringify({
        ...data,
        images: uploadedImages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create review');
    }
    return response.json();
  };

  const updateReviewAction = async (reviewId: string, data: ReviewFormValues) => {
    const uploadedImages = await Promise.all(
      imageFiles
        .filter((file) => !imagePreviews.some((img) => img.file === file && img.publicId)) // Only upload new files
        .map((file) => uploadImageToCloudinary(file, 'Imagelubna/reviews'))
    );

    const finalImages = [
      ...imagePreviews.filter((img) => img.publicId),
      ...uploadedImages,
    ];

    const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        images: finalImages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update review');
    }
    return response.json();
  };

  const deleteReviewAction = async (reviewId: string) => {
    const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete review');
    }
    return response.json();
  };

   const onSubmit: SubmitHandler<ReviewFormValues> = async (values) => {
    try {
      setLoading(true);
      
      if (initialData?.id) {
        
        await updateReviewAction(initialData.id, values);
        toast.success('Ulasan berhasil diperbarui!');
      } else {
        
        await createReviewAction(productId, values);
        toast.success('Ulasan berhasil ditambahkan!');
      }
      resetFormState();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan ulasan.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData?.id) return;
    try {
      setLoading(true);
      await deleteReviewAction(initialData.id);
      toast.success('Ulasan berhasil dihapus.');
      resetFormState();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus ulasan.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const title = initialData ? "Edit Review" : "Tambah Review Baru";
  const action = initialData ? "Perbarui Ulasan" : "Tambah Ulasan";
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {initialData && (
            <div className="flex space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={loading}>
                    <Trash className="h-4 w-4 mr-1" /> Hapus Ulasan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus ulasan ini secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {imagePreviews.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={loading}>
                      <Trash className="h-4 w-4 mr-1" /> Hapus Semua Gambar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini akan menghapus semua gambar ulasan secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllImages}>
                        Hapus Semua
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Ulasan</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      disabled={loading}
                      placeholder="Tulis ulasan Anda di sini..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? String(field.value) : undefined}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Pilih Rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} Bintang
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar Ulasan</FormLabel>
                  <FormControl>
                    <div className="space-y-4 flex items-start gap-2">
                      <div className="w-30 h-30 border-dashed border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
                      onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        width={96}
                        height={96}
                        
                        disabled={loading}
                        onChange={handleFileChange}
                        className="hidden file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((image, index) => (
                          <div key={image.id} className="relative">
                            <Image
                              src={image.url}
                              alt="Review image"
                              width={96}
                              height={96}
                              className="w-30 h-30 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0"
                              onClick={() => handleRemoveImage(index)}
                              disabled={loading}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading}
            >
               {loading ? (
                <Loader2 className="h-4 w-full animate-spin" />
              ) : (
                <span>{action}</span>
              )}
            </Button>
             
          </form>
        </Form>
      </CardContent>     
    </Card>
  );
};

export default ReviewForm;