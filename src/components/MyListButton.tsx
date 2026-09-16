"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { isInList, toggleList, type SavedItem } from "@/lib/storage";

export function MyListButton({ item }: { item: SavedItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => setSaved(isInList(item.id, item.media_type));
    refresh();
    window.addEventListener("reel:storage", refresh);
    return () => window.removeEventListener("reel:storage", refresh);
  }, [item.id, item.media_type]);

  const onClick = () => {
    const nowSaved = toggleList(item);
    setSaved(nowSaved);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition-colors duration-300 ${
        saved
          ? "border-fg bg-fg text-bg"
          : "border-border text-fg hover:bg-surface"
      }`}
    >
      {saved ? "✓ In My List" : "+ Add to My List"}
    </motion.button>
  );
}