"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { products } from "@/lib/data";
import { ShoppingBag } from "lucide-react";

const dummyCustomers = [
  { name: "Budi", avatar: "/Image/lubna.png" },
  { name: "Siti", avatar: "/Image/lubna.png" },
  { name: "Ahmad", avatar: "/Image/lubna.png" },
  { name: "Dewi", avatar: "/Image/lubna.png" },
  { name: "Rina", avatar: "/Image/lubna.png" },
];

export function PurchaseNotification() {
  useEffect(() => {
    const showDummyPurchase = () => {
      const randomCustomer = dummyCustomers[Math.floor(Math.random() * dummyCustomers.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const timeAgo = Math.floor(Math.random() * 5) + 1;
      toast.custom(() => (
        <div className="flex items-cente gap-3 p-3 bg-card border rounded-lg shadow-lg max-w-sm w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={randomCustomer.avatar} alt={randomCustomer.name} />
            <AvatarFallback>{randomCustomer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-lg text-green-500 font-medium">
              <span className="font-bold">{randomCustomer.name}</span> membeli{" "}
              <span className="font-semibold">{randomProduct.name}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {timeAgo} menit yang lalu
            </p>
          </div>
          <ShoppingBag className="h-6 w-6 text-green-500" />
        </div>
      ), {
        duration: 5000,
        position: "bottom-right", 
      });
    };
    showDummyPurchase();

    const interval = setInterval(showDummyPurchase, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}