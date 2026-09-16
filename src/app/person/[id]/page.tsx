"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import {
  getPerson,
  getPersonCredits,
  calculateAge,
  IMG,
  type PersonDetail,
  type CreditItem,
} from "@/lib/tmdb";

export default function PersonPage() {
  const params = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [credits, setCredits] = useState<CreditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    Promise.all([getPerson(params.id), getPersonCredits(params.id)])
      .then(([p, c]) => {
        setPerson(p);
        setCredits(c);
      })
      .catch(() => setPerson(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Person not found.</p>
      </main>
    );
  }

  const age = calculateAge(person.birthday, person.deathday);
  const lifespan = person.birthday
    ? `${person.birthday}${person.deathday ? ` – ${person.deathday}` : ""}`
    : null;

  return (
    <main className="min-h-screen px-6 pt-32 pb-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full shrink-0 md:w-[280px]"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-surface">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No photo
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display text-4xl leading-tight tracking-tight md:text-5xl"
            >
              {person.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 flex flex-col gap-3 text-sm"
            >
              {person.known_for_department && (
                <Row label="Known for" value={person.known_for_department} />
              )}
              {lifespan && (
                <Row
                  label="Born"
                  value={age !== null ? `${lifespan} (age ${age})` : lifespan}
                />
              )}
              {person.place_of_birth && (
                <Row label="From" value={person.place_of_birth} />
              )}
            </motion.div>

            {person.biography && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8"
              >
                <h2 className="font-display text-lg tracking-tight">Biography</h2>
                <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-fg/85 whitespace-pre-line">
                  {person.biography}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Credits */}
        {credits.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
              Known for
            </h2>
            <div className="rail -mx-6 flex gap-5 overflow-x-auto px-6 pb-3 md:-mx-16 md:px-16">
              {credits.map((c, i) => {
                const title = c.title ?? c.name ?? "Untitled";
                const date = c.release_date ?? c.first_air_date ?? "";
                const year = date ? date.slice(0, 4) : "—";
                const href =
                  c.media_type === "tv" ? `/tv/${c.id}` : `/movie/${c.id}`;

                return (
                  <motion.div
                    key={`${c.media_type}-${c.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(i * 0.03, 0.3),
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    whileHover={{ y: -6 }}
                    className="shrink-0 w-[140px] md:w-[160px]"
                  >
                    <Link href={href} className="block">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface">
                        {c.poster_path ? (
                          <img
                            src={IMG.poster(c.poster_path)}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted">
                            No poster
                          </div>
                        )}
                      </div>
                      <h3 className="mt-3 font-display text-sm leading-snug line-clamp-1">
                        {title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {c.character ? `as ${c.character}` : year}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <span className="text-fg/90">{value}</span>
    </div>
  );
}