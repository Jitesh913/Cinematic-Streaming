"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MovieCard, type Media } from "@/components/MovieCard";
import { searchMulti } from "@/lib/tmdb";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      searchMulti(query)
        .then((items) =>
          setResults(
            items.map((x) => ({
              id: x.id,
              title: x.title,
              name: x.name,
              overview: x.overview,
              poster_path: x.poster_path,
              backdrop_path: x.backdrop_path,
              release_date: x.release_date,
              first_air_date: x.first_air_date,
              vote_average: x.vote_average,
              media_type: x.media_type as "movie" | "tv",
            }))
          )
        )
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen px-6 pt-32 pb-24 md:px-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-display text-4xl tracking-tight md:text-5xl"
      >
        Search
      </motion.h1>

      <motion.input
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies and shows…"
        className="mt-8 w-full max-w-xl rounded-full border border-border bg-surface px-6 py-3 text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-muted"
        autoFocus
      />

      {loading && <p className="mt-6 text-sm text-muted">Searching…</p>}

      {!loading && results.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((movie, i) => (
            <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} index={i} />
          ))}
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="mt-6 text-sm text-muted">No results for "{query}".</p>
      )}
    </main>
  );
}