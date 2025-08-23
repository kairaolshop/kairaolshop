import Link from 'next/link'
import React from 'react'
import BannerSlider from './BannerSlider'
import { getBanners } from '@/lib/actions/get-Banner'
import { Button } from '../ui/button';

export default async function HeroSection() {
  const banners = await getBanners();
   const hasBanners = Array.isArray(banners) && banners.length > 0;
  return (
    <section className="bg-[radial-gradient(circle,_#FFF5E1,_#FAF9F6)] bg-background-alt-1 rounded-t-lg shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-20 gap-y-2 items-center">
            <div className="items-center mt-0 mt:mt-4 ml-0 lg:ml-20 sm:ml-0 h-[300px] sm:h-[420px] lg:h-[430px] overflow-hidden">                
                {hasBanners ? (
                <BannerSlider banners={banners} />
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500">
                      Tidak ada banner tersedia saat ini.
                    </div>
                  )}
            </div>
            <div className="text-center mt-2 lg:mt-0 lg:text-left p-4">
          <h1 className="text-lg md:text-2xl font-bold mb-4 ">
            Selamat Datang di Lubna Fashion
          </h1>
          <p className="text-sm md:text-lg mb-6">
            Temukan koleksi pakaian wanita terbaru dan paling stylish untuk setiap kesempatan.
            Dari gaun elegan hingga pakaian kasual yang nyaman, kami memiliki semuanya untuk Anda.
          </p>
          <Link href="#produk">
            <Button size="sm" className="text-sm px-4 py-2">
              Jelajahi Koleksi
            </Button>
          </Link>
        </div>
        </div>

    </section>
  )
}
