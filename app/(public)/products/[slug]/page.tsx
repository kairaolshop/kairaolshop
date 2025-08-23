import { Suspense } from "react";

// Library Eksternal
import { FaWhatsapp } from "react-icons/fa";

// Komponen
import Gallery from "@/components/gallery";
import ProductInfo from "@/components/gallery/info";
import ReviewSlider from "@/components/gallery/reviews";
import GallerySkeleton from "@/components/gallery/GallerySkeleton";
import ProductInfoSkeleton from "@/components/gallery/InfoSkeleton";
import ProductSection from "@/components/products/ProductSection";
import StickyHeader from "@/components/products/StickyHeader";
import HeaderTetap from "@/components/products/HeaderTetap";
import Container from "@/components/ui/container";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CountdownTimer } from "@/components/ui/TimerDown";
import { SiteFooter } from "@/components/public/Footer";

// Utils dan Actions
import { getProductBySlug } from "@/lib/actions/product";
import { rP } from "@/lib/utils";

// Revalidate data setiap 60 detik
export const revalidate = 60;
export const dynamic = "force-dynamic";

interface DetailProductPageProps {
  params: { slug: string };
}

// Komponen utama halaman
export default async function DetailProductPage({
  params,
}: DetailProductPageProps) {
  const { slug } = params;

  return (
    <>
      <HeaderTetap />
      <Container>
        <Suspense fallback={<DetailProductPageSkeleton />}>
          <DetailProductContent slug={slug} />
        </Suspense>
      </Container>
      <SiteFooter />
    </>
  );
}

// Skeleton untuk seluruh halaman
function DetailProductPageSkeleton() {
  return (
    <div className="py-0 md:py-10">
      <div className="grid grid-cols-1 items-start gap-x-8 overflow-hidden md:grid-cols-2">
        <GallerySkeleton />
        <div className="mt-2 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductInfoSkeleton />
        </div>
      </div>
    </div>
  );
}

// Komponen yang memuat data dan merender konten produk
async function DetailProductContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-600">Produk tidak ditemukan.</div>
    );
  }

  const productUrl = `${siteUrl}/products/${slug}`;
  const whatsappMessage = `Halo, saya tertarik dengan produk ${
    product.name
  } ❤️ yang Anda jual seharga Rp ${rP(product.price)}.
Apakah produk ini masih tersedia? Cek produk:
${productUrl}`;

  return (
    <>
      <div className="md:hidden">
        <StickyHeader
          productName={product.name}
          phoneNumber={phoneNumber}
          whatsappMessage={whatsappMessage}
        />
      </div>

      <div className="bg-white">
        <div className="py-0 md:py-10">
          <div className="grid grid-cols-1 items-start gap-x-8 overflow-hidden md:grid-cols-2">
            {/* Gallery dan Info Produk */}
            <Gallery images={product.images} />
            <div className="mt-2 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Section Countdown */}
        <section className="mt-4 rounded-t-2xl bg-gray-200 shadow-inner">
          <h2 className="mt-4 text-center text-xl font-bold text-primary md:text-xl">
            Diskon Berakhir Dalam: <CountdownTimer />
          </h2>
          <div className="mb-4">
            {/* Konten Suspense kosong */}
          </div>
        </section>

        {/* Section Grosir */}
        <section className="container px-4 py-2">
          <div className="rounded-lg bg-gradient-to-r from-gray-900 to-green-900 p-6 text-center text-white shadow-xl md:p-8">
            <h2 className="mb-4 text-lg font-bold md:text-xl">
              Beli Banyak Lebih Murah, Kami Melayani Grosir!
            </h2>
            <p className="text-sm md:text-xl">
              Dapatkan harga spesial untuk pembelian dalam jumlah besar. Cocok
              untuk reseller dan kebutuhan bisnis Anda.
            </p>
            <WhatsAppButton
              className="mt-4"
              phoneNumber={phoneNumber}
              message={whatsappMessage}
            >
              <FaWhatsapp className="h-8 w-8" /> Tanya Harga Grosir
            </WhatsAppButton>
          </div>
        </section>

        {/* Section Review */}
        <div className="border-l-1 border-r-1 rounded-b-xl bg-green-200 px-4 py-2 text-center">
          <h1 className="select-none text-sm font-bold md:text-sm">
            Kata Mereka 💕
          </h1>
        </div>
        {product.reviews.length === 0 ? (
          <div className="rounded-b-xl border-l-1 border-r-1 px-4 py-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Belum ada ulasan untuk produk ini
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center border-l-1 border-r-1 px-2 md:px-50">
            <ReviewSlider reviews={product.reviews} />
          </div>
        )}

        {/* Section Produk Terkait */}
        <section className="mb-4 rounded-b-lg border-b-1 border-l-1 border-r-1 bg-[radial-gradient(circle,_#FFF5E1,_#FAF9F6)] bg-background-alt-1">
          <div className="flex items-center justify-between px-2 py-4">
            <hr className="w-20 border-t border-gray-400 md:w-60" />
            <span className="select-none text-sm font-bold text-black sm:text-xl">
              Kamu mungkin juga suka
            </span>
            <hr className="w-20 border-t border-gray-400 md:w-60" />
          </div>
          <Suspense
            fallback={
              <div className="p-4 text-center">Memuat produk terkait...</div>
            }
          >
            <ProductSection currentProductSlug={product.slug} />
          </Suspense>
        </section>
      </div>
    </>
  );
}