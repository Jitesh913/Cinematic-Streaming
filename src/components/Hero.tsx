"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IMG, type Movie } from "@/lib/tmdb";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function Hero({ movie }: { movie: Movie }) {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      {movie.backdrop_path && (
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={IMG.backdrop(movie.backdrop_path)}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/30 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full max-w-3xl flex-col justify-end px-6 pb-24 md:px-16 md:pb-32"
      >
        <motion.p
          variants={item}
          className="mb-4 text-xs uppercase tracking-[0.3em] text-muted"
        >
          Featured this week
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
        >
          {movie.title}
        </motion.h1>

        <motion.div variants={item} className="mt-5 flex items-center gap-4 text-sm text-muted">
          <span>{movie.release_date?.slice(0, 4)}</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>{movie.vote_average?.toFixed(1)} / 10</span>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-[15px] leading-relaxed text-fg/80 line-clamp-3"
        >
          {movie.overview}
        </motion.p>

        <motion.div variants={item} className="mt-8 flex gap-3">
          <Link
            href={`/movie/${movie.id}`}
            className="rounded-full bg-fg px-7 py-3 text-sm font-medium text-bg transition-transform duration-300 hover:scale-[1.03]"
          >
            Watch now
          </Link>
          <Link
            href={`/movie/${movie.id}`}
            className="rounded-full border border-border px-7 py-3 text-sm text-fg transition-colors duration-300 hover:bg-surface"
          >
            More info
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}