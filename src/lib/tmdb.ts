const TOKEN = process.env.TMDB_TOKEN ?? "";

export const IMG = {
  poster: (path: string, size: "w342" | "w500" | "w780" = "w500") =>
    `https://image.tmdb.org/t/p/${size}${path}`,
  backdrop: (path: string, size: "w1280" | "original" = "w1280") =>
    `https://image.tmdb.org/t/p/${size}${path}`,
};

export type Movie = {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type TVShow = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
  seasons?: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string | null;
  }[];
};

export type PersonDetail = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string | null;
  homepage: string | null;
};

export type CreditItem = {
  id: number;
  title?: string;
  name?: string;
  character?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
  vote_average: number;
  overview: string;
  backdrop_path: string | null;
};

export type DiscoverResult = {
  results: Movie[];
  page: number;
  total_pages: number;
};

export type DiscoverFilters = {
  genre?: string;
  year?: string;
  sort?: string;
};

export type Episode = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
};

export type SeasonDetail = {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episodes: Episode[];
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
};

export type WatchProviderResult = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
};

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  // Build a query string
  const search = new URLSearchParams(params).toString();

  // Determine base URL:
  // - Server-side: talk to TMDB directly with the token
  // - Client-side: proxy through our own /api/tmdb route
  const isServer = typeof window === "undefined";
  const base = isServer
    ? `https://api.themoviedb.org/3`
    : `/api/tmdb`;

  const url = `${base}${path}${search ? `?${search}` : ""}`;

  const headers: HeadersInit = isServer
    ? {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };

  const res = await fetch(url, {
    headers,
    ...(isServer ? { next: { revalidate: 3600 } } : {}),
  });

  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

// ---------- Movies ----------

export const getTrending = () =>
  tmdb<{ results: Movie[] }>("/trending/movie/week").then((r) => r.results);

export const getPopular = () =>
  tmdb<{ results: Movie[] }>("/movie/popular").then((r) => r.results);

export const getTopRated = () =>
  tmdb<{ results: Movie[] }>("/movie/top_rated").then((r) => r.results);

export const getNowPlaying = () =>
  tmdb<{ results: Movie[] }>("/movie/now_playing").then((r) => r.results);

export const getUpcoming = () =>
  tmdb<{ results: Movie[] }>("/movie/upcoming").then((r) => r.results);

export const getMovie = (id: string | number) => tmdb<Movie>(`/movie/${id}`);

export const searchMovies = (q: string) =>
  tmdb<{ results: Movie[] }>("/search/movie", { query: q }).then((r) => r.results);

export const getByGenre = (genreId: number, sort = "popularity.desc") =>
  tmdb<{ results: Movie[] }>("/discover/movie", {
    with_genres: String(genreId),
    sort_by: sort,
  }).then((r) => r.results);

export const discoverMovies = (page: number, filters: DiscoverFilters = {}) => {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: filters.sort ?? "popularity.desc",
  };
  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  return tmdb<DiscoverResult>("/discover/movie", params);
};

// ---------- TV ----------

export const getTrendingTV = () =>
  tmdb<{ results: Movie[] }>("/trending/tv/week").then((r) => r.results);

export const getPopularTV = () =>
  tmdb<{ results: Movie[] }>("/tv/popular").then((r) => r.results);

export const getTopRatedTV = () =>
  tmdb<{ results: Movie[] }>("/tv/top_rated").then((r) => r.results);

export const getAiringToday = () =>
  tmdb<{ results: Movie[] }>("/tv/airing_today").then((r) => r.results);

export const getTVShow = (id: string | number) => tmdb<TVShow>(`/tv/${id}`);

export const discoverShows = (page: number, filters: DiscoverFilters = {}) => {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: filters.sort ?? "popularity.desc",
  };
  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.first_air_date_year = filters.year;
  return tmdb<DiscoverResult>("/discover/tv", params);
};

// ---------- Trailers ----------

export const getTrailer = async (id: string | number): Promise<string | null> => {
  const data = await tmdb<{ results: Video[] }>(`/movie/${id}/videos`);
  const trailer = data.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  return trailer?.key ?? null;
};

export const getTVTrailer = async (id: string | number): Promise<string | null> => {
  const data = await tmdb<{ results: Video[] }>(`/tv/${id}/videos`);
  const trailer = data.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  return trailer?.key ?? null;
};

// ---------- Cast ----------

export const getCredits = async (id: string | number): Promise<CastMember[]> => {
  const data = await tmdb<{ cast: CastMember[] }>(`/movie/${id}/credits`);
  return data.cast.slice(0, 12);
};

export const getTVCredits = async (id: string | number): Promise<CastMember[]> => {
  const data = await tmdb<{ cast: CastMember[] }>(`/tv/${id}/credits`);
  return data.cast.slice(0, 12);
};

// ---------- People ----------

export const getPerson = (id: string | number) =>
  tmdb<PersonDetail>(`/person/${id}`);

export const getPersonCredits = async (id: string | number) => {
  const data = await tmdb<{ cast: CreditItem[] }>(`/person/${id}/combined_credits`);
  return data.cast
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 30);
};

export const calculateAge = (
  birthday: string | null,
  deathday: string | null
): number | null => {
  if (!birthday) return null;
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age;
};

// ---------- Seasons ----------

export const getSeasonEpisodes = (tvId: string | number, seasonNumber: number) =>
  tmdb<SeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`);

// ---------- Watch providers ----------

export const getWatchProviders = async (
  id: string | number,
  mediaType: "movie" | "tv" = "movie",
  region: string = "IN"
): Promise<WatchProviderResult | null> => {
  const data = await tmdb<{ results: Record<string, WatchProviderResult> }>(
    `/${mediaType}/${id}/watch/providers`
  );
  return data.results?.[region] ?? null;
};