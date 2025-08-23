"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductInfoSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full md:w-1/2">
      {/* Title */}
      <Skeleton className="h-8 w-3/4 rounded-md" />

      {/* Price */}
      <Skeleton className="h-6 w-1/4 rounded-md" />

      {/* Description */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded-md" />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
