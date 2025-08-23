import { prisma } from "@/lib/prisma";
import { ProductForm } from "./components/product-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string; }>;
}) => {
  const { productId } =await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  const safeProduct = product
    ? {
        ...product,
        price: Number(product.price),
        discountPrice: product.discountPrice
          ? Number(product.discountPrice)
          : null,
      }
    : null;
  const categories = await prisma.category.findMany();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={safeProduct} categories={categories} />
      </div>
    </div>
  );
};

export default ProductPage;
