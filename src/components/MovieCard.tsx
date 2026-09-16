"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IMG } from "@/lib/tmdb";

export type Media = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: "movie" | "tv";
};

export function MovieCard({
  movie,
  index = 0,
}: {
  movie: Media;
  index?: number;
}) {
  const displayTitle = movie.title ?? movie.name ?? "Untitled";
  const date = movie.release_date ?? movie.first_air_date ?? "";
  const year = date ? date.slice(0, 4) : "—";
  const isTV = !movie.title && !!movie.name;
  const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative shrink-0 w-full"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface">
          {movie.poster_path ? (
            <motion.img
              src={IMG.poster(movie.poster_path)}
              alt={displayTitle}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted text-sm">
              No poster
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-fg backdrop-blur-sm">
            {movie.vote_average?.toFixed(1)}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-display text-[15px] leading-snug tracking-tight line-clamp-1">
            {displayTitle}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{year}</p>
        </div>
      </Link>
    </motion.div>
  );
}