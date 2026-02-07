import { MainNav } from "@/components/ui/main-navbar";
import {ProductClient} from "./components/client"
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Separator } from "@radix-ui/react-separator";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
    images: true, 
    category: true, 
  },
    orderBy: { createdAt: "desc" },
  });

  const formatted = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.discountPrice?.toString() || "-",
    originalPrice: item.price.toString(),
    description: item.description.toString()  ?? "",
    category: item.category?.name || "_",
    isPublished: item.isPublished,
    createdAt:format(item.createdAt, "dd MMM yyyy"),
    images: item.images.map(img => ({
      url: img.url,
      altText: item.name
    })),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto border rounded-sm shadow mt-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin Panel</h1>      
      <Separator className="border-b mb-4"/>
      <ProductClient data={formatted} />
    </div>
  );
}
