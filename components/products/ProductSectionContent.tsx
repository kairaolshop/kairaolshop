import { getAuthSession } from "@/lib/auth";
import { getProducts } from "@/lib/actions/product";
import { getCategory } from "@/lib/actions/getCategory";
import FilteredProductDisplay from "./FilterProduct";


interface ProductSectionContentProps {
  currentProductSlug?: string;
}

export default async function ProductSectionContent({ currentProductSlug }: ProductSectionContentProps) {
  const session = await getAuthSession();
  const userRole = session?.user?.role || "GUEST";

  // ambil data secara paralel biar lebih cepat
  const [categories, initialProducts] = await Promise.all([
    getCategory(),
    getProducts({ excludeSlug: currentProductSlug, limit: 4 }),
  ]);

  return (
    <FilteredProductDisplay
      categories={categories}
      initialProducts={initialProducts}
      userRole={userRole}
      favoriteProductIds={[]}
      excludeSlug={currentProductSlug}
    />
  );
}
