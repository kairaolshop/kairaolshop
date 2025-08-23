import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import Image from "next/image";
import  ReviewForm  from "../reviews/[reviewsId]/components/review-form";
import  CellAction  from "../reviews/components/cell-Actions";

interface ReviewsPageProps {
  params: Promise<{ productId: string }>;
}

const ReviewsPage = async ({ params }: ReviewsPageProps) => {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true },
  });

  const reviews = await prisma.review.findMany({
    where: { productId: productId },
    include: { images: true },
  });

  return (
    <div className="max-w-7xl border mt-4 rounded-sm mx-auto">
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`Ulasan untuk produk: ${product?.name || "Produk"}`}
          description="Kelola ulasan produk"
        />
        <Separator />
        <Heading title="Tambah ulasan baru" description="Menambahkan ulasan produk baru" />
        <ReviewForm initialData={null} productId={productId} />
        <Separator />
        <Heading title="Ulasan produk" description={`${reviews.length} ulasan`} />
        {reviews.length === 0 ? (
          <p>Belum ada ulasan untuk produk ini.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-md flex justify-between items-start">
                <div>
                  <p className="font-semibold">Rating: {review.rating}/5</p>
                  <p>Komentar: {review.comment}</p>
                  {review.images.length > 0 && (
                    <div>
                      <p className="mt-2">Gambar:</p>
                      <div className="flex space-x-2 mt-1">
                        {review.images.map((img) => (
                          <Image
                            key={img.id}
                            src={img.url}
                            alt="Gambar ulasan"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <CellAction reviewId={review.id} productId={productId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ReviewsPage;