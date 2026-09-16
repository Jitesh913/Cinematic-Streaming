"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { getList, removeFromList, type SavedItem } from "@/lib/storage";
import { IMG } from "@/lib/tmdb";

export default function MyListPage() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const refresh = () => setItems(getList());
    refresh();

    window.addEventListener("reel:storage", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("reel:storage", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <main className="min-h-screen px-6 pt-32 pb-24 md:px-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-display text-4xl tracking-tight md:text-5xl"
      >
        My List
      </motion.h1>
      <p className="mt-4 text-muted">
        {items.length > 0 ? `${items.length} saved` : "Nothing saved yet."}
      </p>

      {items.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((it, i) => {
            const href =
              it.media_type === "tv" ? `/tv/${it.id}` : `/movie/${it.id}`;
            return (
              <motion.div
                key={`${it.media_type}-${it.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i * 0.03, 0.3),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group relative"
              >
                <Link href={href} className="block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface">
                    {it.poster_path ? (
                      <img
                        src={IMG.poster(it.poster_path)}
                        alt={it.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        No poster
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-sm leading-snug line-clamp-1">
                    {it.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {it.date ? it.date.slice(0, 4) : "—"}
                  </p>
                </Link>
                <button
                  onClick={() => removeFromList(it.id, it.media_type)}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-fg opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:bg-black/90"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}