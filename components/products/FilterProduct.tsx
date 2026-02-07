"use client";

import { useState, useEffect } from "react";
import ProductList from './ProductList';
import { getProducts, ProductTransformed } from '@/lib/actions/product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalize } from "@/lib/utils";
import { getFavorites } from "@/lib/actions/get-favorits";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilteredProductDisplayProps {
  initialProducts: ProductTransformed[];
  userRole: "USER" | "ADMIN" | "GUEST";
  favoriteProductIds: string[];
  categories: Category[];
  excludeSlug?: string;
}

const INITIAL_LIMIT = 8;

export default function FilteredProductDisplay({
  initialProducts,
  userRole,
  favoriteProductIds,
  categories,
  excludeSlug,
}: FilteredProductDisplayProps) {
  const [products, setProducts] = useState<ProductTransformed[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(initialProducts.length);
  const [hasMore, setHasMore] = useState(initialProducts.length === INITIAL_LIMIT);
  const [favorites, setFavorites] = useState<string[]>(favoriteProductIds);

  useEffect(() => {
    if (userRole === "USER") {
      getFavorites().then((res) => {
        setFavorites(res.map(p => p.id));
      }).catch(err => console.error("Gagal memuat favorit:", err));
    }
  }, [userRole]);
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    // Panggil loadProducts dengan filter baru
    loadProducts(true, newCategory);
};

  const loadProducts = async (isNewFilter = false, newCategory?: string) => {
    setIsLoading(true);

    const querySkip = isNewFilter ? 0 : skip;
    const categoryParam = (newCategory || selectedCategory) === "all" ? undefined : selectedCategory;

    try {
        const newProducts = await getProducts({
            limit: INITIAL_LIMIT,
            skip: querySkip,
            excludeSlug: excludeSlug,
            orderBy: "createdAt",
            orderDirection: "desc",
            category: categoryParam,
        });

        if (isNewFilter) {
            setProducts(newProducts);
            setSkip(newProducts.length);
        } else {
            setProducts(prevProducts => [...prevProducts, ...newProducts]); // PERBAIKAN: Gabungkan array
            setSkip(prevSkip => prevSkip + newProducts.length);
        }

        setHasMore(newProducts.length === INITIAL_LIMIT);
    } catch (error) {
        console.error("Gagal memuat produk:", error);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <>
      <div className="flex text-sm justify-center mb-6">
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                {capitalize(cat.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductList
        products={products}
        userRole={userRole}
        favoriteProductIds={favorites}
        onLoadMore={() => loadProducts()}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </>
  );
}