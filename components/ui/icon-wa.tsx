import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface IconWhatsappProps {
  phoneNumber: string;
  message: string;
  className?: string;
}

const IconWhatsapp: React.FC<IconWhatsappProps> = ({
  phoneNumber,
  message,
  className,
}) => {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-10 right-4 lg:right-24 xl:right-1/12 z-50 p-2 md:p-4 rounded-full shadow-lg transition-colors duration-300",
        "bg-green-500 text-white hover:bg-green-600",
        className
      )}
      aria-label="Hubungi kami via WhatsApp"
    >
      <FaWhatsapp className="h-8 w-8 md:w-10 md:h-10" />
    </a>
  );
};

export default IconWhatsapp;
