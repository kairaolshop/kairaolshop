import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getFavorites } from "@/lib/actions/get-favorits";
import { ProductTransformed } from "@/lib/actions/product";
import { Frown } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/products/productCard";
import { getCategory } from "@/lib/actions/getCategory";
import Header from "@/components/public/Header";

export const revalidate = 60;
export const dynamic = 'force-dynamic';

const FavoritesPage = async () => {
  const session = await getAuthSession(); 
  const categories = await getCategory();

  if (!session || !session.user || session.user.role !== "USER") {
    
    redirect("/login");
  }

  let favoriteProducts: ProductTransformed[] = [];
  let error: string | null = null;

  try {
    
    favoriteProducts = await getFavorites();
  } catch (err) {
    console.error("Failed to fetch favorite products:", err);
    
    
    if (err instanceof Error) {
      error = err.message;
    } else {
      
      error = "Gagal memuat produk favorit. Silakan coba lagi nanti.";
    }
  }

  return (
    <>
    <Header categories={categories} session={session}/>
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl border-b-2 font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
        Produk Favorit Anda 💕
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {favoriteProducts.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
          <Frown className="h-20 w-20 mb-4" />
          <p className="text-xl font-semibold mb-2">
            Belum ada produk favorit di sini.
          </p>
          <p className="text-md text-center">
            Mulai jelajahi produk kami dan tambahkan favorit Anda!
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Jelajahi Produk
          </Link>
        </div>
      )}

      {favoriteProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              data={product} 
              isInitialFavorite={true}
              userRole={session?.user.role} 
            />
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default FavoritesPage;