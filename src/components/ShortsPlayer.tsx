"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IMG } from "@/lib/tmdb";
import type { ShortItem } from "@/lib/shorts";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });

  return ytApiPromise;
}

export function ShortsPlayer({
  item,
  active,
  muted,
  onToggleMute,
  onNeedMore,
}: {
  item: ShortItem;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onNeedMore: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Init player when trailerKey becomes available
  useEffect(() => {
    if (!item.trailerKey || !containerRef.current) return;

    let destroyed = false;

    loadYouTubeApi().then(() => {
      if (destroyed || !containerRef.current || !window.YT) return;

      const inner = document.createElement("div");
      inner.style.width = "100%";
      inner.style.height = "100%";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(inner);

      playerRef.current = new window.YT.Player(inner, {
        videoId: item.trailerKey,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          loop: 1,
          playlist: item.trailerKey,
          mute: 1,
        },
        events: {
          onReady: (e: any) => {
            if (destroyed) return;
            setLoaded(true);
            e.target.mute();
            if (active) {
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.trailerKey]);

  // Play/pause based on active + paused + muted
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !loaded) return;

    try {
      if (active && !paused) {
        p.playVideo();
        if (muted) p.mute();
        else p.unMute();
      } else {
        p.pauseVideo();
      }
    } catch {
      // ignore
    }
  }, [active, paused, muted, loaded]);

  // Trigger "load more" when active near the end
  useEffect(() => {
    if (active) onNeedMore();
  }, [active, onNeedMore]);

  const href = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <section className="relative h-screen w-full snap-start overflow-hidden bg-black">
      {/* Blurred backdrop */}
      {item.backdrop_path && (
        <img
          src={IMG.backdrop(item.backdrop_path, "w1280")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 blur-2xl scale-110"
        />
      )}

      {/* Video container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="relative aspect-video w-full max-w-[min(100vw,calc(100vh*16/9))]">
          <div
            ref={containerRef}
            className="absolute inset-0 h-full w-full"
          />
          {/* Click layer to toggle pause */}
          <button
            onClick={() => setPaused((p) => !p)}
            className="absolute inset-0 z-20 cursor-pointer"
            aria-label={paused ? "Play" : "Pause"}
          />
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="rounded-full bg-black/60 p-6 backdrop-blur-sm">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="white"
              stroke="none"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Mute toggle */}
      <button
        onClick={onToggleMute}
        className="absolute top-24 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-fg backdrop-blur-sm transition-colors duration-200 hover:bg-black/80"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Caption / info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-12 pt-20 md:px-16"
      >
        <Link href={href} className="block">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-white md:text-4xl">
            {item.title}
          </h2>
          <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
            <span>{item.year || "—"}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{item.vote_average?.toFixed(1)} / 10</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="uppercase tracking-wider text-xs">
              {item.media_type === "tv" ? "TV" : "Movie"}
            </span>
          </div>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-white/70 line-clamp-2">
            {item.overview}
          </p>
          <span className="mt-3 inline-block text-xs text-white/50">
            Tap for details →
          </span>
        </Link>
      </motion.div>
    </section>
  );
}