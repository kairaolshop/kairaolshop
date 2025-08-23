import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

// Pastikan Anda memiliki variabel lingkungan NEXT_PUBLIC_WHATSAPP_NUMBER
// di file .env.local Anda, contoh: NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"

const WhatsAppButton = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent("Halo, saya ingin bertanya tentang produk di Lubna Fashion.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  if (!whatsappNumber) {
    console.warn("NEXT_PUBLIC_WHATSAPP_NUMBER is not set in environment variables.");
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center">
          <MessageCircle className="h-6 w-6" />
        </button>
      </Link>
    </div>
  );
};

export default WhatsAppButton;