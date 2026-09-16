"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MovieCard } from "@/components/MovieCard";
import { searchMovies, type Movie } from "@/lib/tmdb";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      searchMovies(query)
        .then((movies) => setResults(movies))
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
        placeholder="Type a movie title…"
        className="mt-8 w-full max-w-xl rounded-full border border-border bg-surface px-6 py-3 text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-muted"
        autoFocus
      />

      {loading && <p className="mt-6 text-sm text-muted">Searching…</p>}

      {results.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-5">
          {results.map((movie, i) => (
            <div
              key={movie.id}
              className="w-[calc(50%-10px)] sm:w-[calc(33.333%-14px)] md:w-[150px] lg:w-[170px]"
            >
              <MovieCard movie={movie} index={i} />
            </div>
          ))}
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="mt-6 text-sm text-muted">No results for "{query}".</p>
      )}
    </main>
  );
}