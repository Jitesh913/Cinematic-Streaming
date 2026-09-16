"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  getMovie,
  getTrailer,
  getCredits,
  IMG,
  type Movie,
  type CastMember,
} from "@/lib/tmdb";
import { TrailerModal } from "@/components/TrailerModal";
import { MyListButton } from "@/components/MyListButton";
import { addToHistory } from "@/lib/storage";

export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    Promise.all([
      getMovie(params.id),
      getTrailer(params.id),
      getCredits(params.id),
    ])
      .then(([m, t, c]) => {
        setMovie(m);
        setTrailerKey(t);
        setCast(c);
        addToHistory({
          id: m.id,
          media_type: "movie",
          title: m.title,
          poster_path: m.poster_path,
          vote_average: m.vote_average,
          date: m.release_date ?? "",
          addedAt: Date.now(),
        });
      })
      .catch((err) => {
        console.error("MOVIE FETCH ERROR:", err);
        setMovie(null);
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Movie not found.</p>
      </main>
    );
  }

  const year = movie.release_date?.slice(0, 4) ?? "—";

  return (
    <main className="min-h-screen">
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={IMG.backdrop(movie.backdrop_path)}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
      </div>

      <div className="relative z-10 -mt-40 mx-auto max-w-5xl px-6 md:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-4xl leading-tight tracking-tight md:text-6xl"
        >
          {movie.title}
        </motion.h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>{year}</span>
          {movie.runtime && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>{movie.runtime} min</span>
            </>
          )}
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>{movie.vote_average?.toFixed(1)} / 10</span>
        </div>

        {movie.genres && (
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 max-w-[65ch] text-[16px] leading-relaxed text-fg/85"
        >
          {movie.overview || "No synopsis available."}
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-3">
          {trailerKey && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-7 py-3 text-sm font-medium text-bg"
            >
              ▶ Watch trailer
            </motion.button>
          )}
          <MyListButton
            item={{
              id: movie.id,
              media_type: "movie",
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average,
              date: movie.release_date ?? "",
              addedAt: Date.now(),
            }}
          />
        </div>

        {cast.length > 0 && (
          <section className="mt-16 pb-24">
            <h2 className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
              Cast
            </h2>
            <div className="rail -mx-6 flex gap-5 overflow-x-auto px-6 pb-3 md:-mx-16 md:px-16">
              {cast.map((person, i) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i * 0.04, 0.4),
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="shrink-0 w-[120px] md:w-[140px]"
                >
                  <Link href={`/person/${person.id}`} className="block">
                    <div className="aspect-[2/3] overflow-hidden rounded-md bg-surface">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                          alt={person.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted">
                          No photo
                        </div>
                      )}
                    </div>
                    <p className="mt-3 font-display text-sm leading-tight line-clamp-2">
                      {person.name}
                    </p>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      as {person.character || "—"}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <TrailerModal
        trailerKey={modalOpen ? trailerKey : null}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}