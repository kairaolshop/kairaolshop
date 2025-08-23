"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function GallerySkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Skeleton className="w-full md:w-2/3 h-96 rounded-lg" />
      <div className="flex md:flex-col gap-2 md:w-1/3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-md" />
        ))}
      </div>
    </div>
  );
}
