"use client";

import {toast }from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { ProductColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Edit, Eye, EyeOff, Megaphone, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/Alert-Modals";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    
    try {
      setLoading(true);
      await axios.delete(`/api/products/${data.id}`);
      router.refresh();
      toast.success("Produk berhasil dihapus");
    } catch (error) {
      console.log(error,"ada yang salah")
      toast.error("Gagal menghapus produk, cek koneksi atau data!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onTogglePublish = async (productId:string, isPublished: boolean )=>
  {try {
    setLoading(true);
    await axios.patch(`api/products/${productId}/publish`,{isPublished: !isPublished});
    router.refresh();
    toast.success(`Produk berhasil ${isPublished ? 'Disembunyikan': 'Ditampilkan'}`);
  } catch(err){
    console.error('Toggel publish error:', err);
    toast.error('Gagal mengubah status publish, cek koneksi atau data!');
  }finally{setLoading(true)}
};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/${data.id}/reviews`)}>
            <Megaphone className="mr-2 h-4 w-4" />
            Review
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Ubah
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4 bg-red-500 text-white rounded-sm" />
            Delete
          </DropdownMenuItem>
           <DropdownMenuItem onClick={()=> onTogglePublish(data.id, data.isPublished)} className="cursor-pointer" >
            {data.isPublished ? (
              <><EyeOff className="mr-2 h-4 w-4"/>Sembunyikan</>
            ):(<><Eye className="mr-2 h-4 w-4"/>Tampilkan</>)}           
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
