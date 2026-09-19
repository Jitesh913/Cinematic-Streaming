"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide on home and shorts
  if (pathname === "/" || pathname.startsWith("/shorts")) return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.back()}
      aria-label="Go back"
      className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-muted backdrop-blur-md transition-colors duration-300 hover:bg-surface hover:text-fg"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </motion.button>
  );
}