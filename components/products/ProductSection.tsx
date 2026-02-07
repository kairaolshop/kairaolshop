import { Suspense } from "react";
import ProductSectionContent from "./ProductSectionContent";


interface ProductSectionProps {
  currentProductSlug?: string;
}

export default function ProductSection({ currentProductSlug }: ProductSectionProps) {
  return (
    <Suspense fallback={<p className="text-center">Memuat produk...</p>}>
      <ProductSectionContent currentProductSlug={currentProductSlug} />
    </Suspense>
  );
}
