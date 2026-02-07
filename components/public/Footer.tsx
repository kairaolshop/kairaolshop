import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

  
//  const whatsappMessage = `Halo, saya tertarik dengan produk dari website anda.`;
//  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; 
//  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || '#';
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || '#';
export function SiteFooter() {

  return(
    
  <footer>
    <div className="mt-auto md:max-w-7xl mx-auto justify-between items-center ">
      <section className="gap-4 px-4  ms-auto flex flex-col items-center md:flex-row  justify-between">
      {/* <div className="flex flex-col md:flex-wrap items-center">
          <h3 className="text-2xl font-bold ">Lubna Fashion</h3>
        <div className="flex mt-0 md:mt-2">            
            <span className="text-xs">Sambut hari dengan senyum</span>
            </div>
            </div>*/}
            <div className="flex flex-col md:flex-wrap items-center">
              <p className="tex-sm text-muted-foreground md:mb-2">Tersedia Jasa Kirim</p>
            <div className="md:flex flex-col md:flex-row items-center mt-4 md:mt-0 gap-y-0  md:gap-x-4 grid grid-cols-2 gap-10 md:gap-20">
              <Image src="/Image/jne.svg" alt="jne" width={70} height={70} className="h-15 w-25 md:h-15 md:w-15  object-contain" />
              <Image src="/Image/jnt.svg" alt="jnt" width={70} height={70} className="h-15 w-25 md:h-15 md:w-15 object-contain" />
              <Image src="/Image/pos.svg" alt="pos" width={70} height={70} className="h-15 w-25 md:h-15 md:w-15 object-contain" />
              <Image src="/Image/lion.svg" alt="lion" width={70} height={70} className="h-15 w-25 md:h-15 md:w-15 object-contain" />
            </div>
        </div>
         <div className="flex flex-col md:flex-wrap justify-center items-center">
          <div className="texr-sm text-muted-foreground mb-4">Ikuti Kami</div>
              <div className="flex  justify-center items-center md:justify-start space-x-4">
               {/* <Link href={whatsappLink}  target="_blank" rel="noopener noreferrer" className="" >
                <button 
                className="bg-transparent hover:bg-transparent">
                  <FaWhatsapp  className="h-10 w-10" />
                </button>
              </Link> */}
                <Link href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 object-contain">
              <FaFacebook size={34} />
            </Link>
            <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 object-contain">
              <FaInstagram size={34} />
            </Link>
            <Link href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="h-10 w-10 object-contain">
              <FaTiktok size={34} />
            </Link>

              </div>
         </div>
      </section>

    </div>

  {/* Copyright */}
  <div className="text-center py-4 max-w-7xl mx-auto bg-[radial-gradient(circle,_#FFF5E1,_#FAF9F6)]">
    <p className="text-sm lg:text-lg text-muted-foreground">
      &copy; {new Date().getFullYear()} Lubna Fashion. All rights reserved.
    </p>
  </div>
</footer>
  );
}