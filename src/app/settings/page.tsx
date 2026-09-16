"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { getHistory, clearHistory, type SavedItem } from "@/lib/storage";
import { IMG } from "@/lib/tmdb";

export default function SettingsPage() {
  const [history, setHistory] = useState<SavedItem[]>([]);

  useEffect(() => {
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener("reel:storage", refresh);
    return () => window.removeEventListener("reel:storage", refresh);
  }, []);

  return (
    <main className="min-h-screen px-6 pt-32 pb-24 md:px-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-display text-4xl tracking-tight md:text-5xl"
      >
        Settings
      </motion.h1>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-12 max-w-4xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-tight">
            Watch history
          </h2>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="rounded-full border border-border px-4 py-1.5 text-xs text-muted transition-colors duration-300 hover:bg-surface hover:text-fg"
            >
              Clear history
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Nothing watched yet. Open a movie or show to start tracking.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            {history.map((it) => {
              const href =
                it.media_type === "tv" ? `/tv/${it.id}` : `/movie/${it.id}`;
              return (
                <Link
                  key={`${it.media_type}-${it.id}-${it.addedAt}`}
                  href={href}
                  className="flex items-center gap-4 rounded-md border border-border p-3 transition-colors duration-200 hover:bg-surface"
                >
                  {it.poster_path ? (
                    <img
                      src={IMG.poster(it.poster_path, "w342")}
                      alt={it.title}
                      className="h-[60px] w-[40px] shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="h-[60px] w-[40px] shrink-0 rounded bg-surface" />
                  )}
                  <div className="flex flex-1 flex-col">
                    <p className="font-display text-sm leading-tight">
                      {it.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {it.media_type === "tv" ? "TV" : "Movie"}
                      {it.date && ` · ${it.date.slice(0, 4)}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(it.addedAt).toLocaleDateString()}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </motion.section>
    </main>
  );
}