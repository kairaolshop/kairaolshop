
"use client";
import ProductCard from '@/components/products/productCard';
import { ProductTransformed } from '@/lib/actions/product';
import { Button } from '@/components/ui/button';

interface ProductListProps {
  products: ProductTransformed[];
  userRole: "USER" | "ADMIN" | "GUEST" | undefined;
  favoriteProductIds: string[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function ProductList({
  products,
  userRole,
  favoriteProductIds,
  onLoadMore,
  hasMore,
  isLoading
}: ProductListProps) {
  
  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              data={product} 
              isInitialFavorite={favoriteProductIds.includes(product.id)}
              userRole={userRole}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500">
          Tidak ada produk terbaru saat ini.
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center py-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            className="px-2 py-1  hover:bg-black text-black border-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Memuat..." : "Produk Lainnya"}
          </Button>
        </div>
      )}
    </>
  );
}