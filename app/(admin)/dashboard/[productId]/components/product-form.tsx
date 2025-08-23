'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Category } from '@prisma/client';
import { ImagePlus, Loader2, Trash, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/Alert-Modals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { uploadImageToCloudinary, UploadedImage } from '@/lib/utils/cloudynary';
import Image from 'next/image';
import { TransformedProduct } from '@/types/product';
import { formSchema, ProductFormValues } from '@/components/validation/productSchema';
import { ConfirmModal } from './ConfirmModal';

interface ProductFormProps {
  initialData: TransformedProduct | null;
  categories: Category[];
}

interface ImagePreview {
  id: string;
  url: string;
  publicId?: string;
  file?: File;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const params = useParams();
  const router = useRouter();
  const [deletedImagePublicIds, setDeletedImagePublicIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>(
    initialData?.images?.map((img) => ({
      id: img.publicId, 
      url: img.url,
      publicId: img.publicId,
    })) || []
  );

  const title = initialData ? 'Edit Produk' : 'Buat Produk Baru';
  const description = initialData ? 'Edit Produk Toko' : 'Buat Produk Toko';
  const toastMessage = initialData ? 'Produk berhasil diedit' : 'Produk berhasil dibuat';
  const action = initialData ? 'Simpan Perubahan' : 'Simpan Produk';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          images: initialData.images || [],
          price: initialData.price ?? null,
          discountPrice: initialData.discountPrice ?? null,
          categoryId: initialData.categoryId || '',
          description: initialData.description || '',
          isPublished: initialData.isPublished,
        }
      : {
          name: '',
          images: [],
          price: null,
          discountPrice: null,
          description: '',
          categoryId: '',
          isPublished: false,
        },
  });

  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [imagePreviews]);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);
  const newPreviews = files.map((file) => ({
    id: `temp-${Date.now()}-${Math.random()}`,
    url: URL.createObjectURL(file),
    file,
  }));

  const currentPreviews = imagePreviews;
  const updatedPreviews = [...currentPreviews, ...newPreviews];
  setImagePreviews(updatedPreviews);

  const updatedImagesForForm = updatedPreviews.map(p => ({
    url: p.url,
    publicId: p.id
  })); 

  form.setValue('images', updatedImagesForForm, { shouldDirty: true, shouldValidate: true });
};
const removeImage = (id: string) => {
  const removedImage = imagePreviews.find((img) => img.id === id);
  if (removedImage?.url.startsWith('blob:')) {
    URL.revokeObjectURL(removedImage.url);
  }
  if (removedImage?.publicId) {
    setDeletedImagePublicIds((prev) => [...prev, removedImage.publicId!]);
    
  }
  
  const updatedPreviews = imagePreviews.filter((img) => img.id !== id);
  setImagePreviews(updatedPreviews);
  
  const updatedImagesForForm = updatedPreviews.map(p => ({
    url: p.url,
    publicId: p.publicId || p.id
  }));
  
  form.setValue('images', updatedImagesForForm, { shouldDirty: true, shouldValidate: true });
};

const onSubmit = async (data: ProductFormValues) => {
  try {
    setLoading(true);

    const imagesToUpload = imagePreviews.filter((img) => img.file);
    const existingImages = imagePreviews.filter((img) => !img.file);

    const uploadedImages: UploadedImage[] = await Promise.all(
      imagesToUpload.map(img => uploadImageToCloudinary(img.file!, 'ImageLubna'))
    );

    const updatedPreviews = [
      ...existingImages,
      ...uploadedImages.map((img, index) => ({
        id: img.publicId,
        url: img.url,
        publicId: img.publicId,
      })),
    ];
    setImagePreviews(updatedPreviews);

    const finalImages: UploadedImage[] = [
      ...existingImages.map(img => ({ url: img.url, publicId: img.publicId! })),
      ...uploadedImages,
    ];

    const payload = { ...data, images: finalImages, deletedImagePublicIds };
    if (initialData) {
      await axios.patch(`/api/products/${params.productId}`, payload);
    } else {
      await axios.post(`/api/products`, payload);
    }
    router.refresh();
    router.push(`/dashboard`);
    toast.success(toastMessage);
  } catch (error) {
    console.error(error);
    toast.error('Cek kembali data yang diinput');
  } finally {
    setLoading(false);
  }
};

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${params.productId}`);
      router.refresh();
      router.push(`/dashboard`);
      toast.success('Produk berhasil dihapus');
    } catch (error) {
      console.error(error);
      toast.error('Cek kembali data dan koneksi Anda');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCancel = () => {   
    form.reset(
      initialData
      ? {
          name: initialData.name,
          images: initialData.images || [],
          price: initialData.price ?? null,
          discountPrice: initialData.discountPrice ?? null,
          categoryId: initialData.categoryId || '',
          description: initialData.description || '',
          isPublished: initialData.isPublished,
        }
      : {
          name: '',
          images: [],
          price: null,
          discountPrice: null,
          description: '',
          categoryId: '',
          isPublished: false,
        }
    );
    imagePreviews.forEach((img) => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImagePreviews(
      initialData?.images?.map((img) => ({
        id: img.publicId,
        url: img.url,
        publicId: img.publicId,
      })) || []
    );
    
    toast.info('Perubahan dibatalkan',);
    setTimeout(() => {router.push("/dashboard");},2000)
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
    <div className='mx-auto max-w-7xl rounded-sm border p-6'>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between mb-8">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator className='mb-8' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gambar Produk</FormLabel>
                <FormControl>
                  <div className='flex items-start gap-2'>
                  <div className="w-30 h-30 border-dashed border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
                  onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    <input
                    ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={loading}
                      onChange={handleFileChange}
                    />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {imagePreviews.map((img) => (
                        <div key={img.id} className="relative">
                          <Image
                            src={img.url}
                            alt={`Preview ${img.id}`}
                            className="w-30 h-30 object-cover rounded"
                            width={96}
                            height={96}
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                            onClick={() => removeImage(img.id)}
                            disabled={loading}
                          >
                           <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>                
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-between space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Produk" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Jual</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rp"
                      disabled={loading}
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : parseInt(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Diskon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rp"
                      disabled={loading}
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      Produk ini akan ditampilkan di toko.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
          </div>
          <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi"
                      disabled={loading}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="flex space-x-4">
           <Button disabled={loading} type="submit">
              {loading ? (
                <Loader2 className="h-4 w-full animate-spin" />
              ) : (
                <span>{action}</span>
              )}
            </Button>
            <ConfirmModal
            title='Batalkan Perubahan'
            description='Apakah anda yakin ingin membatalkan perubahan'
            onConfirm={onCancel}
            trigger={
            <Button
              disabled={loading}
              variant="outline"
              type="button"              
            > Batalkan
            </Button>}/>
          </div>
        </form>
      </Form>
      <Separator className='mt-4'/>
      </div>
    </>
  );
};