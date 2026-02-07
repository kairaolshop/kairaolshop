'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface CellActionProps {
  reviewId: string;
  productId: string;
}

const CellAction: React.FC<CellActionProps> = ({ reviewId, productId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteReview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus ulasan');
      }
      toast.success('Ulasan berhasil dihapus!');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus ulasan.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews/${reviewId}/images`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus semua gambar ulasan');
      }
      toast.success('Semua gambar ulasan berhasil dihapus!');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus gambar.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/${productId}/reviews/${reviewId}`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Ulasan
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash className="mr-2 h-4 w-4" />
              Hapus Ulasan
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus ulasan ini secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteReview}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash className="mr-2 h-4 w-4" />
              Hapus Semua Gambar
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus semua gambar ulasan secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAllImages}>
                Hapus Semua
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;