// app/category/[categoryName]/page.tsx

import { getProductsByCategory, getCategory } from "@/lib/actions/getCategory";
import { getFavorites } from "@/lib/actions/get-favorits";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Header from "@/components/public/Header";
import { SiteFooter } from "@/components/public/Footer";
import ProductCard from "@/components/products/productCard";


interface CategoryPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const awaitedParams= await params;
  const categoryName = awaitedParams.categoryName;
  const categorySlug = categoryName.toLowerCase();
  const [categories, session, filteredProducts] = await Promise.all([
    getCategory(),
    getServerSession(authOptions),
    getProductsByCategory(categorySlug),
  ]);

  const userRole = session?.user?.role || "GUEST";
  const favoriteProductIds = new Set<string>();
  if (userRole === "USER") {
    try {
      const favorites = await getFavorites();
      favorites.forEach(p => favoriteProductIds.add(p.id));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  }
  const currentCategory = categories.find(c => c.slug === categorySlug);

  if (filteredProducts.length === 0) {
    return (
      <>
        <Header categories={categories} session={session} />
        <main className="max-w-7xl mx-auto flex-col flex items-center py-8 md:py-12">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Produk Kategori &quot;{currentCategory?.name || "Tidak Ditemukan"}&quot;
          </h1>
          <p className="text-lg text-muted-foreground">
            Maaf, belum ada produk di kategori ini.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  // Tampilkan daftar produk jika ada
  return (
    <>
      <Header categories={categories} session={session} />
      <main className=":max-w-7xl mx-auto flex-col justify-between flex items-center py-8 md:py-12">
        <h1 className="text-lg  md:text-2xl font-bold text-center mb-8">
          Produk Kategori &quot;{currentCategory?.name || "Tidak Ditemukan"}&quot;
        </h1>
        <div className="grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              data={product}
              isInitialFavorite={favoriteProductIds.has(product.id)}
              userRole={userRole}
            />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}