"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { MovieCard, type Media } from "@/components/MovieCard";
import { discoverMovies } from "@/lib/tmdb";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { FilterBar } from "@/components/FilterBar";
import { MOVIE_GENRES, YEARS } from "@/lib/genres";
import { ComingSoonRail } from "@/components/ComingSoonRail";
import { GridSkeleton } from "@/components/Skeletons";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("popularity.desc");

  const loadPage = useCallback(
    async (p: number, reset = false) => {
      setLoading(true);
      try {
        const data = await discoverMovies(p, { genre, year, sort });
        setMovies((prev) => (reset ? data.results : [...prev, ...data.results]));
        setTotalPages(data.total_pages);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [genre, year, sort]
  );

  useEffect(() => {
    setPage(1);
    loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (loading || page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    loadPage(next);
  }, [loading, page, totalPages, loadPage]);

  const sentinelRef = useInfiniteScroll(loadMore, !loading && page < totalPages);

  return (
    <main className="min-h-screen px-6 pt-32 pb-24 md:px-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-display text-4xl tracking-tight md:text-5xl"
      >
        Movies
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 text-muted"
      >
        Browse popular films.
      </motion.p>

        <ComingSoonRail mediaType="movie" />

      <FilterBar
        genre={genre}
        genres={MOVIE_GENRES}
        onGenreChange={setGenre}
        year={year}
        onYearChange={setYear}
        sort={sort}
        onSortChange={setSort}
        years={YEARS}
      />

      <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((m, i) => (
          <MovieCard key={`${m.id}-${i}`} movie={m} index={i % 18} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-20" />

      {loading && movies.length === 0 && (
        <div className="mt-12">
          <GridSkeleton count={12} />
        </div>
      )}

      {loading && movies.length > 0 && (
        <div className="mt-12">
          <GridSkeleton count={6} />
        </div>
      )}

      {!loading && page >= totalPages && movies.length > 0 && (
        <p className="text-center text-sm text-muted">You've reached the end.</p>
      )}
    </main>
  );
}