"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ComingSoonCard, type ComingSoonItem } from "./ComingSoonCard";
import { getUpcomingMovies, getOnTheAirTV } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";

export function ComingSoonRail({ mediaType }: { mediaType: "movie" | "tv" }) {
  const [items, setItems] = useState<ComingSoonItem[]>([]);

  useEffect(() => {
    const fetcher = mediaType === "movie" ? getUpcomingMovies : getOnTheAirTV;

    fetcher()
      .then((movies: Movie[]) => {
        const mapped: ComingSoonItem[] = movies
          .filter((m) => !!(m.release_date ?? m.first_air_date))
          .slice(0, 20)
          .map((m) => ({
            id: m.id,
            media_type: mediaType,
            title: m.title ?? m.name ?? "Untitled",
            poster_path: m.poster_path,
            date: m.release_date ?? m.first_air_date ?? null,
            vote_average: m.vote_average,
          }));
        setItems(mapped);
      })
      .catch(() => setItems([]));
  }, [mediaType]);

  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="mt-10"
    >
      <h2 className="mb-4 font-display text-lg tracking-tight md:text-xl">
        Coming soon
      </h2>
      <div className="rail -mx-6 flex gap-3 overflow-x-auto px-6 pb-3 md:-mx-16 md:px-16">
        {items.map((item, i) => (
          <ComingSoonCard key={`${item.media_type}-${item.id}`} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  );
}