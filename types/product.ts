export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string; // kalau mau include slug juga
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  category: Category;
  isPublished: boolean;
  images: ProductImage[];
}

export interface TransformedProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  discountPrice: number | null;
  images: ProductImage[];
  isPublished: boolean;
  createdAt: Date;
}