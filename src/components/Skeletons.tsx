"use client";

import { motion } from "motion/react";

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
      />
    </div>
  );
}

export function CardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.25) }}
      className="w-full"
    >
      <Shimmer className="aspect-[2/3] rounded-md" />
      <Shimmer className="mt-3 h-3.5 w-3/4 rounded" />
      <Shimmer className="mt-2 h-2.5 w-1/3 rounded" />
    </motion.div>
  );
}

export function GridSkeleton({
  count = 12,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
}: {
  count?: number;
  cols?: string;
}) {
  return (
    <div className={`grid gap-5 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <main className="min-h-screen">
      <div className="relative h-[60vh] min-h-[420px] w-full">
        <Shimmer className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
      </div>
      <div className="relative z-10 -mt-40 mx-auto max-w-5xl px-6 md:px-16">
        <Shimmer className="h-12 w-2/3 max-w-lg rounded-md md:h-16" />
        <div className="mt-5 flex items-center gap-4">
          <Shimmer className="h-4 w-12 rounded" />
          <Shimmer className="h-4 w-16 rounded" />
          <Shimmer className="h-4 w-14 rounded" />
        </div>
        <div className="mt-8 space-y-2 max-w-[65ch]">
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-3/4 rounded" />
        </div>
        <div className="mt-8 flex gap-3">
          <Shimmer className="h-11 w-40 rounded-full" />
          <Shimmer className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </main>
  );
}