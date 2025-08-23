"use client";

import { ProductImage } from "@/lib/actions/product";
import { cn } from "@/lib/utils";
import { Tab } from "@headlessui/react";
import Image from "next/image";

interface GalleryTabProps {
  images: ProductImage;
  isFirstImage: boolean; // Tambahkan prop ini
}


const GalleryTab: React.FC<GalleryTabProps> = ({ images, isFirstImage }) => {
  const PlaceholderImg = "/product-img-placeholder.svg";
  const altText = images.url ? "Thumbnail produk" : PlaceholderImg;
  return (
    <Tab className="relative flex aspect-square min-w-[90px] sm:min-w-[100px] lg:min-w-[110px] cursor-pointer items-center justify-center bg-white">
      {({ selected }) => (
        <div className="relative w-full h-full">
          {/* Gambar */}
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <Image
              fill
              src={images.url || PlaceholderImg}
              alt={altText || 'Thumbnail produk'}
              sizes="(max-width: 640px) 90px, 110px"
              className="object-cover"
              priority={isFirstImage}
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-orange-400" : "ring-transparent"
            )}
          ></span>
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;