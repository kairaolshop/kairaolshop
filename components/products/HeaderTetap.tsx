
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const HeaderTetap = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
     const currentScrollPos = window.pageYOffset;
      if (currentScrollPos > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-transform duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 max-w-7xl mx-auto flex-col justify-center border-b p-2`}>
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/Image/lubna.png" alt="logo toko" width={30} height={30} className="w-8 h-8" />
        <div className="text-sm font-semibold">Lubna Fashion</div>
      </Link>
    </header>
  );
};

export default HeaderTetap;