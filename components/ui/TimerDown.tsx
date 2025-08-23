// components/CountdownTimer.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  // Tidak ada lagi `endDate` sebagai prop
  className?: string;
}

export function CountdownTimer({ className }: CountdownTimerProps) {
  type TimeLeft = {
    days: number;
    jam: number;
    menit: number;
    detik: number;
  };
  
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Logika ini hanya berjalan di sisi klien
    const newEndDate = new Date();
    newEndDate.setHours(newEndDate.getHours() + 15);
    setEndDate(newEndDate);

    const timer = setInterval(() => {
      if (newEndDate) {
        const difference = +newEndDate - +new Date();
        let calculatedTimeLeft: TimeLeft;

        if (difference > 0) {
          calculatedTimeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
            menit: Math.floor((difference / 1000 / 60) % 60),
            detik: Math.floor((difference / 1000) % 60),
          };
        } else {
          calculatedTimeLeft = { days: 0, jam: 0, menit: 0, detik: 0 };
          clearInterval(timer);
        }
        setTimeLeft(calculatedTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Dependensi kosong, hanya dijalankan sekali

  if (!timeLeft) {
    // Menampilkan sesuatu saat loading agar tidak terjadi hydration error
    return <div className={cn("text-center text-lg font-semibold text-muted-foreground", className)}>Memuat...</div>;
  }

  // Sisa logika komponen seperti sebelumnya
  const timerComponents: React.ReactElement[] = [];
  // ... (lanjutkan kode yang sama)
  const isExpired = Object.values(timeLeft).every(val => val === 0);

  if (isExpired) {
    return (
      <div className={cn("text-center text-lg font-semibold text-muted-foreground", className)}>
        Diskon telah berakhir!
      </div>
    );
  }

  const intervals = Object.keys(timeLeft).filter((interval) => {
    return timeLeft[interval as keyof TimeLeft];
  });

  intervals.forEach((interval, idx) => {
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <p className="text-xl md:text-xl font-bold text-red-500">
          {String(timeLeft[interval as keyof TimeLeft]).padStart(2, '0')}
        </p>
        
      </div>
    );

    if (idx < intervals.length - 1) {
      timerComponents.push(
        <span key={`colon-${idx}`} className="text-xl font-bold text-red-500 px-1">
          :
        </span>
      );
    }
  });

  return (
    <div className={cn("flex justify-center items-center gap-4", className)}>
      {timerComponents.length ? timerComponents : <span>Waktu habis!</span>}
    </div>
  );
}