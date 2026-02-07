"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Product Tersedia (${data.length})`}
          description="Atur Product Untuk Toko"
        />
        <Button onClick={() => router.push(`/dashboard/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk baru
        </Button>
      </div>
      <DataTable data={data} columns={columns} searchKey="name" />      
    </>
  );
};
