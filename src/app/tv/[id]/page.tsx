"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  getTVShow,
  getTVTrailer,
  getTVCredits,
  getSeasonEpisodes,
  IMG,
  type TVShow,
  type CastMember,
  type Episode,
} from "@/lib/tmdb";
import { TrailerModal } from "@/components/TrailerModal";
import { MyListButton } from "@/components/MyListButton";
import { addToHistory } from "@/lib/storage";

export default function TVPage() {
  const params = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShow | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [episodesBySeason, setEpisodesBySeason] = useState<
    Record<number, Episode[]>
  >({});
  const [openSeason, setOpenSeason] = useState<number | null>(null);
  const [loadingSeason, setLoadingSeason] = useState<number | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    Promise.all([
      getTVShow(params.id),
      getTVTrailer(params.id),
      getTVCredits(params.id),
    ])
      .then(([s, t, c]) => {
        setShow(s);
        setTrailerKey(t);
        setCast(c);
        addToHistory({
          id: s.id,
          media_type: "tv",
          title: s.name,
          poster_path: s.poster_path,
          vote_average: s.vote_average,
          date: s.first_air_date ?? "",
          addedAt: Date.now(),
        });
      })
      .catch(() => setShow(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const toggleSeason = async (seasonNumber: number) => {
    if (openSeason === seasonNumber) {
      setOpenSeason(null);
      return;
    }

    setOpenSeason(seasonNumber);

    if (!episodesBySeason[seasonNumber] && params?.id) {
      setLoadingSeason(seasonNumber);
      try {
        const data = await getSeasonEpisodes(params.id, seasonNumber);
        setEpisodesBySeason((prev) => ({
          ...prev,
          [seasonNumber]: data.episodes,
        }));
      } catch {
        setEpisodesBySeason((prev) => ({ ...prev, [seasonNumber]: [] }));
      } finally {
        setLoadingSeason(null);
      }
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  if (!show) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Show not found.</p>
      </main>
    );
  }

  const year = show.first_air_date?.slice(0, 4) ?? "—";

  return (
    <main className="min-h-screen">
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {show.backdrop_path && (
          <img
            src={IMG.backdrop(show.backdrop_path)}
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
          {show.name}
        </motion.h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>{year}</span>
          {show.number_of_seasons && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>
                {show.number_of_seasons} season
                {show.number_of_seasons > 1 ? "s" : ""}
              </span>
            </>
          )}
          {show.number_of_episodes && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>{show.number_of_episodes} episodes</span>
            </>
          )}
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>{show.vote_average?.toFixed(1)} / 10</span>
        </div>

        {show.genres && (
          <div className="mt-4 flex flex-wrap gap-2">
            {show.genres.map((g) => (
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
          {show.overview || "No synopsis available."}
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
              id: show.id,
              media_type: "tv",
              title: show.name,
              poster_path: show.poster_path,
              vote_average: show.vote_average,
              date: show.first_air_date ?? "",
              addedAt: Date.now(),
            }}
          />
        </div>

        {cast.length > 0 && (
          <section className="mt-16">
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

        {show.seasons && show.seasons.length > 0 && (
          <section className="mt-16 pb-24">
            <h2 className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
              Seasons
            </h2>
            <div className="flex flex-col gap-2">
              {show.seasons
                .filter((s) => s.season_number > 0)
                .map((s) => {
                  const isOpen = openSeason === s.season_number;
                  const episodes = episodesBySeason[s.season_number];
                  const isLoading = loadingSeason === s.season_number;

                  return (
                    <div
                      key={s.id}
                      className="overflow-hidden rounded-md border border-border"
                    >
                      <button
                        onClick={() => toggleSeason(s.season_number)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-surface"
                      >
                        <span className="font-display text-base">
                          {s.name}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="text-xs text-muted">
                            {s.episode_count} episodes
                            {s.air_date && ` · ${s.air_date.slice(0, 4)}`}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-muted"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </motion.span>
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="flex flex-col divide-y divide-border">
                              {isLoading && (
                                <p className="px-5 py-6 text-sm text-muted">
                                  Loading episodes…
                                </p>
                              )}
                              {!isLoading &&
                                episodes &&
                                episodes.length === 0 && (
                                  <p className="px-5 py-6 text-sm text-muted">
                                    No episodes available.
                                  </p>
                                )}
                              {!isLoading &&
                                episodes &&
                                episodes.map((ep) => (
                                  <div
                                    key={ep.id}
                                    className="flex gap-4 px-5 py-4"
                                  >
                                    {ep.still_path ? (
                                      <img
                                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                                        alt={ep.name}
                                        className="h-[68px] w-[120px] shrink-0 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-[68px] w-[120px] shrink-0 items-center justify-center rounded border border-border bg-surface/50">
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="text-muted/60"
                                        >
                                          <rect
                                            x="2"
                                            y="3"
                                            width="20"
                                            height="14"
                                            rx="2"
                                          />
                                          <path d="m10 8 5 3-5 3V8Z" />
                                        </svg>
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-1">
                                      <p className="font-display text-sm leading-tight">
                                        {ep.episode_number}. {ep.name}
                                      </p>
                                      {ep.air_date && (
                                        <p className="text-xs text-muted">
                                          {ep.air_date}
                                        </p>
                                      )}
                                      {ep.overview && (
                                        <p className="mt-1 text-xs leading-relaxed text-fg/70 line-clamp-3">
                                          {ep.overview}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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