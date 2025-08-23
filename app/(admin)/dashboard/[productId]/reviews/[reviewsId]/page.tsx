import prisma from "@/lib/prisma";
import ReviewForm  from "../[reviewsId]/components/review-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";
export const revalidate =  0;
interface ReviewImage {
  id: string;
  url: string;
  publicId: string;
  file?: File;
}

interface ReviewFormValues {
  comment: string;
  rating: number;
  images?: ReviewImage[];
}
interface EditReviewPageProps {
  params:Promise< { productId: string; reviewsId: string }>;
}

const EditReviewPage = async ({ params }: EditReviewPageProps) => {
  const { productId, reviewsId } =await params;
  const review = await prisma.review.findUnique({
    where: { id: reviewsId, productId: productId },
    include: { images: true },
  });

  if (!review) {
   
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title="Ulasan tidak di temukan" description="Belum ada Ulasan untuk produk ini." />
        </div>
      </div>
    );
  }; 
  
  const initialData: ReviewFormValues & {id: string}={
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    images:review.images.map((img) =>({
      id: img.id || crypto.randomUUID(),
      url: img.url,
      publicId: img.publicId,
    }))
  }; 

  return (
     <div className="max-w-6xl mx-auto">
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Edit Review"
          description="Edit an existing product review"
        />
        <Separator />
        <ReviewForm initialData={initialData} productId={productId} />
      </div>
    </div>
    </div>
  );
};

export default EditReviewPage;