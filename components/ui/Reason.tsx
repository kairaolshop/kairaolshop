import React from "react";
import { CheckCircle, Heart, Truck, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  {
    title: "Kualitas Premium",
    description:
      "Setiap produk kami dibuat dengan bahan terbaik dan perhatian terhadap detail, menjamin kenyamanan dan daya tahan.",
    icon: CheckCircle,
  },
  {
    title: "Desain Eksklusif",
    description:
      "Temukan gaya unik yang memadukan tradisi dengan tren modern, dirancang khusus untuk muslimah masa kini.",
    icon: Heart,
  },
 
];


export function Reason() {
  return (
    <section className=" md:py-8 bg-background items-center text-foreground">
      <div className="container px-2 sm:px-4 lg:px-8 mx-auto">
        <h2 className="text-lg md:text-2xl font-bold text-center mb-2">
          Mengapa Memilih Lubna Fashion?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2  gap-4">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="flex flex-col p-2 text-center bg-card text-card-foreground border-border shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-2 flex flex-col items-center">
                <reason.icon className="h-6 w-6 text-green-500 mb-2" />
                <h3 className="text-sm md:text-lg font-semibold mb-4">{reason.title}</h3>
                <p className="text-muted-foreground md:text-sm text-xs">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
