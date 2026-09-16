"use client";

import { getTrending, getPopular, getTrendingTV, getPopularTV, type Movie } from "./tmdb";

export type ShortItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  year: string;
  trailerKey: string | null;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fetch trailer for a single movie or show
async function fetchTrailer(
  id: number,
  media_type: "movie" | "tv"
): Promise<string | null> {
  const res = await fetch(`/api/tmdb/${media_type}/${id}/videos`);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    results: { key: string; site: string; type: string }[];
  };
  const trailer = data.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  return trailer?.key ?? null;
}

// Build a pool from trending + popular (movies and TV), shuffled
export async function buildShortsPool(): Promise<ShortItem[]> {
  const [trendingMovies, popularMovies, trendingTV, popularTV] =
    await Promise.all([
      getTrending().catch(() => []),
      getPopular().catch(() => []),
      getTrendingTV().catch(() => []),
      getPopularTV().catch(() => []),
    ]);

  const movies: Movie[] = [...trendingMovies, ...popularMovies];
  const shows: Movie[] = [...trendingTV, ...popularTV];

  const seen = new Set<string>();
  const combined: { item: Movie; media_type: "movie" | "tv" }[] = [];

  for (const m of movies) {
    const k = `movie-${m.id}`;
    if (!seen.has(k)) {
      seen.add(k);
      combined.push({ item: m, media_type: "movie" });
    }
  }
  for (const s of shows) {
    const k = `tv-${s.id}`;
    if (!seen.has(k)) {
      seen.add(k);
      combined.push({ item: s, media_type: "tv" });
    }
  }

  // Randomize order
  const randomized = shuffle(combined).slice(0, 40);

  return randomized.map(({ item, media_type }) => ({
    id: item.id,
    media_type,
    title: item.title ?? item.name ?? "Untitled",
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    year: (item.release_date ?? item.first_air_date ?? "").slice(0, 4),
    trailerKey: null,
  }));
}

export { fetchTrailer };