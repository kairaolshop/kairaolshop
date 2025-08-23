import ProductSection from "@/components/products/ProductSection";
import { SiteFooter } from "@/components/public/Footer";
import Header from "@/components/public/Header";
import HeroSection from "@/components/public/hero-section";
import { PurchaseNotification } from "@/components/purchase-notif";
import IconWhatsapp from "@/components/ui/icon-wa";
import { Reason } from "@/components/ui/Reason";
import { getFavorites } from "@/lib/actions/get-favorits";
import { getCategory } from "@/lib/actions/getCategory";
import { authOptions } from "@/lib/auth";
import { Separator } from "@radix-ui/react-select";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

// Tentukan revalidasi di level page
export const revalidate = 60;

export default async function HomePage() {
  const categories = await getCategory();
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || "GUEST";
  const favoriteProductsIds = new Set<string>();

  if (userRole === "USER") {
    try {
      const favorites = await getFavorites();
      favorites.forEach((p) => favoriteProductsIds.add(p.id));
    } catch (err) {
      console.error(err, "Gagal menambahkan ke Favorited");
    }
  }
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const pesan= "Halo, saya ingin bertanya tentang product di website anda.";
  return (
    <>
      <Header categories={categories} session={session} />
      <main className="flex flex-col min-h-screen mx-auto max-w-7xl">
        <section className="relative overflow-hidden">
          <HeroSection />
        </section>

        {/* --- Bagian Produk Unggulan --- */}
        <section className="container mx-auto py-8 md:py-16">
          <h2 id="produk" className="text-xl md:text-2xl font-extrabold text-center mb-8 text-black capitalize">
            Produk Pilihan untuk Gaya Kekinian
          </h2>
          <Suspense fallback={<p className="text-center text-gray-500">Memuat koleksi terbaru...</p>}>
            <div className="mx-auto border rounded-sm p-2 max-w-5xl">
            <ProductSection />
            </div>
            <Separator className="mt-8"/>
            <Reason/>
          </Suspense>
        </section>
        <IconWhatsapp phoneNumber={phoneNumber} message={pesan} />
      </main>
      <PurchaseNotification/>
      <SiteFooter />
    </>
  );
}