import { Hero } from "@/components/Hero";
import { Rail } from "@/components/Rail";
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getUpcoming,
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getAiringToday,
  getByGenre,
} from "@/lib/tmdb";

export default async function Home() {
  const [
    trending,
    popular,
    topRated,
    nowPlaying,
    upcoming,
    trendingTV,
    popularTV,
    topRatedTV,
    airingToday,
    actionMovies,
    comedyMovies,
    awardWinningDramas,
  ] = await Promise.all([
    getTrending().catch(() => []),
    getPopular().catch(() => []),
    getTopRated().catch(() => []),
    getNowPlaying().catch(() => []),
    getUpcoming().catch(() => []),
    getTrendingTV().catch(() => []),
    getPopularTV().catch(() => []),
    getTopRatedTV().catch(() => []),
    getAiringToday().catch(() => []),
    getByGenre(28).catch(() => []),
    getByGenre(35).catch(() => []),
    getByGenre(18, "vote_average.desc").catch(() => []),
  ]);

  const featured = trending[0];

  const rails: { title: string; movies: typeof trending }[] = [
    { title: "Trending this week", movies: trending.slice(1) },
    { title: "Now playing", movies: nowPlaying },
    { title: "Popular movies", movies: popular },
    { title: "Top rated movies", movies: topRated },
    { title: "Upcoming", movies: upcoming },
    { title: "Trending TV", movies: trendingTV },
    { title: "Airing today", movies: airingToday },
    { title: "Popular TV", movies: popularTV },
    { title: "Top rated TV", movies: topRatedTV },
    { title: "Action", movies: actionMovies },
    { title: "Comedy", movies: comedyMovies },
    { title: "Award-winning dramas", movies: awardWinningDramas },
  ];

  return (
    <main>
      {featured && <Hero movie={featured} />}
      {rails
        .filter((r) => r.movies.length > 0)
        .map((r) => (
          <Rail key={r.title} title={r.title} movies={r.movies} />
        ))}
    </main>
  );
}