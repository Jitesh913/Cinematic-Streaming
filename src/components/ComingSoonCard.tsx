"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IMG } from "@/lib/tmdb";

export type ComingSoonItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  date: string | null;
  vote_average: number;
};

function formatDate(date: string | null): string {
  if (!date) return "TBA";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ComingSoonCard({
  item,
  index = 0,
}: {
  item: ComingSoonItem;
  index?: number;
}) {
  const href = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4 }}
      className="group shrink-0 w-[104px] md:w-[120px]"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface">
          {item.poster_path ? (
            <img
              src={IMG.poster(item.poster_path, "w342")}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted">
              No poster
            </div>
          )}

          {/* Coming Soon tag */}
          <div className="absolute left-1.5 top-1.5 rounded-full bg-black/75 px-2 py-0.5 text-[9px] uppercase tracking-wider text-fg backdrop-blur-sm">
            Coming soon
          </div>
        </div>

        <h3 className="mt-2 font-display text-[13px] leading-tight line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-0.5 text-[11px] text-muted">{formatDate(item.date)}</p>
      </Link>
    </motion.div>
  );
}