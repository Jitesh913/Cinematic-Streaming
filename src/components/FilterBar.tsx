"use client";

import { motion } from "motion/react";

export function FilterBar({
  genre,
  genres,
  onGenreChange,
  year,
  onYearChange,
  sort,
  onSortChange,
  years,
}: {
  genre: string;
  genres: { id: number; name: string }[];
  onGenreChange: (v: string) => void;
  year: string;
  onYearChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  years: string[];
}) {
  const selectClass =
    "appearance-none rounded-full border border-border bg-surface px-5 py-2.5 pr-10 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-muted cursor-pointer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="mt-8 flex flex-wrap items-center gap-3"
    >
      <div className="relative">
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <Chevron />
      </div>

      <div className="relative">
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <Chevron />
      </div>

      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClass}
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="vote_count.desc">Most Voted</option>
        </select>
        <Chevron />
      </div>
    </motion.div>
  );
}

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}