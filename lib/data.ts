export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number; // Harga coret
  images: string[]; // Mengubah dari imageUrl menjadi images (array of strings)
  rating: number; // 1-5 bintang
  reviews: Review[];
};

export type Review = {
  id: string;
  customerName: string;
  customerAvatarUrl: string;
  rating: number;
  comment: string;
  images?: string[]; // Tambahkan properti gambar opsional
};

export const products: Product[] = [
  {
    id: "1",
    name: "Gamis Casual",
    category: "Gamis",
    description: "Gamis kasual yang nyaman dan stylish, cocok untuk dipakai sehari-hari. Terbuat dari kain yang breathable.",
    price: 49.99,
    originalPrice: 69.99,
    images: ["/images/product-1.jpg", "/images/product-1b.jpg", "/images/product-1c.jpg"], // Contoh dengan banyak gambar
    rating: 4.5,
    reviews: [
      { id: "r1", customerName: "Alice Smith", customerAvatarUrl: "/images/avatar-1.jpg", rating: 5, comment: "Suka sekali gamis ini! Sangat nyaman dan terlihat bagus.", images: ["/images/review-1a.jpg", "/images/review-1b.jpg"] },
      { id: "r2", customerName: "Bob Johnson", customerAvatarUrl: "/images/avatar-2.jpg", rating: 4, comment: "Kualitas bagus, sedikit longgar tapi tetap cantik." },
    ],
  },
  {
    id: "2",
    name: "Midi Dress Elegan",
    category: "Midi",
    description: "Midi dress elegan untuk acara-acara khusus. Menampilkan siluet yang menawan dan detail yang halus.",
    price: 89.99,
    images: ["/images/product-2.jpg", "/images/product-2b.jpg"], // Contoh dengan banyak gambar
    rating: 5,
    reviews: [
      { id: "r3", customerName: "Charlie Brown", customerAvatarUrl: "/images/avatar-3.jpg", rating: 5, comment: "Benar-benar menakjubkan! Menerima banyak pujian.", images: ["/images/review-2a.jpg"] },
    ],
  },
  {
    id: "3",
    name: "Setelan Kantor",
    category: "Setelan",
    description: "Setelan profesional dan chic. Ideal untuk lingkungan kantor, menawarkan gaya dan kenyamanan.",
    price: 99.99,
    originalPrice: 120.00,
    images: ["/images/product-3.jpg"],
    rating: 4.8,
    reviews: [
      { id: "r4", customerName: "Diana Prince", customerAvatarUrl: "/images/avatar-4.jpg", rating: 5, comment: "Pas sempurna dan terlihat mewah." },
    ],
  },
  {
    id: "4",
    name: "Gamis Pesta",
    category: "Gamis",
    description: "Gamis mewah untuk acara pesta. Desain modern dan pas yang nyaman.",
    price: 75.00,
    images: ["/images/product-4.jpg"],
    rating: 4.2,
    reviews: [
      { id: "r5", customerName: "Eve Adams", customerAvatarUrl: "/images/avatar-5.jpg", rating: 4, comment: "Bagus untuk pesta, sangat serbaguna." },
    ],
  },
  {
    id: "5",
    name: "Midi Floral",
    category: "Midi",
    description: "Midi dress dengan motif bunga yang cerah dan menarik perhatian. Sempurna untuk membuat pernyataan.",
    price: 65.50,
    originalPrice: 80.00,
    images: ["/images/product-5.jpg"],
    rating: 4.0,
    reviews: [
      { id: "r6", customerName: "Frank White", customerAvatarUrl: "/images/avatar-6.jpg", rating: 4, comment: "Pakaian bagus, cocok untuk acara santai." },
    ],
  },
  {
    id: "6",
    name: "Setelan Santai",
    category: "Setelan",
    description: "Setelan serbaguna untuk ibu modern. Nyaman namun stylish, cocok untuk segala acara.",
    price: 55.00,
    images: ["/images/product-6.jpg"],
    rating: 4.7,
    reviews: [
      { id: "r7", customerName: "Grace Lee", customerAvatarUrl: "/images/avatar-7.jpg", rating: 5, comment: "Setelan favorit saya sekarang! Suka sekali." },
    ],
  },
  {
    id: "7",
    name: "Gamis Modern",
    category: "Gamis",
    description: "Gamis yang cerah dan menarik perhatian. Sempurna untuk membuat pernyataan.",
    price: 70.00,
    originalPrice: 90.00,
    images: ["/images/product-7.jpg"],
    rating: 4.3,
    reviews: [
      { id: "r8", customerName: "Henry King", customerAvatarUrl: "/images/avatar-8.jpg", rating: 4, comment: "Warna cantik, pas dengan baik." },
    ],
  },
  {
    id: "8",
    name: "Midi Casual",
    category: "Midi",
    description: "Midi dress yang chic dan canggih. Menambahkan sentuhan elegan pada setiap pakaian.",
    price: 120.00,
    images: ["/images/product-8.jpg"],
    rating: 4.9,
    reviews: [
      { id: "r9", customerName: "Ivy Green", customerAvatarUrl: "/images/avatar-9.jpg", rating: 5, comment: "Kualitas tinggi dan sangat stylish." },
    ],
  },
  {
    id: "9",
    name: "Setelan Pesta",
    category: "Setelan",
    description: "Setelan yang lembut dan feminin. Ideal untuk tampilan yang lembut dan romantis.",
    price: 85.00,
    originalPrice: 100.00,
    images: ["/images/product-9.jpg"],
    rating: 4.6,
    reviews: [
      { id: "r10", customerName: "Jack Black", customerAvatarUrl: "/images/avatar-10.jpg", rating: 5, comment: "Sangat cantik dan nyaman." },
    ],
  },
  {
    id: "10",
    name: "Gamis Syar'i",
    category: "Gamis",
    description: "Gamis syar'i yang unik dan modern. Tampil beda dengan desain yang khas ini.",
    price: 95.00,
    images: ["/images/product-10.jpg"],
    rating: 4.4,
    reviews: [
      { id: "r11", customerName: "Karen White", customerAvatarUrl: "/images/avatar-11.jpg", rating: 4, comment: "Desain menarik, pas yang bagus." },
    ],
  },
];

// Catatan: Gambar produk dan avatar di atas adalah placeholder.
// Anda perlu menambahkan gambar-gambar ini ke folder `public/images/` agar tampil dengan benar.
// Contoh: public/images/product-1.jpg, public/images/avatar-1.jpg, dst.

export const bannerImages: string[] = [
  "/images/hero-banner.png",
  "/images/product-1.jpg", // Menggunakan gambar produk sebagai contoh banner
  "/images/product-2.jpg", // Menggunakan gambar produk sebagai contoh banner
];

export const categories: string[] = ["Gamis", "Midi", "Setelan"];