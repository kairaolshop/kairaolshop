import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  images: z
    .object({ url: z.string(), publicId: z.string() })
    .array()
    .min(1, "Minimal 1 gambar wajib diunggah"),
  price: z.number().int().positive("Harga harus angka positif.").nullable(),
  discountPrice: z.number().int().positive("Harga diskon harus angka positif.").nullable().optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(10,"Deskripsi produk minimal 10 karakter"),
  isPublished: z.boolean().default(true).optional(),
});
export type ProductFormValues = z.infer<typeof formSchema> & {
    deletedImagePublicIds?: string[];
};