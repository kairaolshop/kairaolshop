"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { BannerWithImagesTransformed } from "@/lib/actions/get-Banner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerSliderProps {
  banners: BannerWithImagesTransformed[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="px-0 relative w-full h-[300px] md:h-[400px] md:mt-4 overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        className="mySwiper h-full rounded-lg"
      >
        {banners.map((banner) => {
          const imageUrl = banner.bannerImages?.[0]?.url || "/placeholder-banner.jpg";
          const altText = banner.description ? `Banner: ${banner.description}` : "Gambar banner promosi";

          return (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"                 
                  className=" object-cover md:object-contain object-center transition-transform duration-300"
                  priority={true} 
                />
                {/* Deskripsi mungkin lebih baik ditampilkan di luar overlay gambar */}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Tombol navigasi tetap di luar Swiper */}
      <Button
        variant="ghost"
        size="icon"
        className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
        aria-label="Next slide"
      >
        <ArrowRight className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default BannerSlider;