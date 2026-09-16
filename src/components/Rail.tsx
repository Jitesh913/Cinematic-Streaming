"use client";

import { MovieCard } from "./MovieCard";
import { Section } from "./Section";
import type { Media } from "./MovieCard";

export function Rail({ title, movies }: { title: string; movies: Media[] }) {
  return (
    <Section className="px-6 py-14 md:px-16">
      <h2 className="mb-6 font-display text-2xl tracking-tight md:text-3xl">{title}</h2>
      <div className="rail -mx-6 flex gap-5 overflow-x-auto px-6 pb-3 md:-mx-16 md:px-16">
        {movies.map((m, i) => (
          <div
            key={m.id}
            className="shrink-0 w-[150px] md:w-[170px]"
          >
            <MovieCard movie={m} index={i} />
          </div>
        ))}
      </div>
    </Section>
  );
}