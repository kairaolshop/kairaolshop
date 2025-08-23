"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";
import Image from "next/image";

export type ProductColumn = {
  id: string;
  name: string;
  price: string; 
  originalPrice: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
   images: { url: string; altText?: string | null }[]; 
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "images",
    header: "Gambar",
    cell: ({ row }) => {
      const images = row.original.images;
      if (!images || images.length === 0) {
        return <span className="text-gray-400">No Image</span>;
      }
      return (
        <div className="flex items-center gap-2">
          {images.slice(0, 1).map((img, i) => (
            <Image
              key={i}
              src={img.url}
              alt={img.altText || row.original.name}
              width={50}
              height={50}
              className="rounded-md object-cover border"
            />
          ))}
          {images.length > 1 && (
            <span className="text-xs text-gray-500">+{images.length - 1}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },

  {
    accessorKey: "isPublished",
    header: "Publish",
    cell: ({ row }) => (
      <span className={row.original.isPublished ? "text-white border rounded-sm px-2 bg-green-500" : "bg-gray-500 text-white border rounded-sm px-2"}>
        {row.original.isPublished ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Harga Diskon",
  },
  {
    accessorKey: "originalPrice",
    header: "Harga Normal",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  
  {
    accessorKey: "createdAt",
    header: "Tanggal",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
