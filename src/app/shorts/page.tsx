"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { ShortsPlayer } from "@/components/ShortsPlayer";
import { buildShortsPool, fetchTrailer, type ShortItem } from "@/lib/shorts";

export default function ShortsPage() {
  const [items, setItems] = useState<ShortItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initial pool
  useEffect(() => {
    buildShortsPool().then(async (pool) => {
      // Fetch trailers for first 5 only, load rest lazily
      const first = await Promise.all(
        pool.slice(0, 5).map(async (it) => ({
          ...it,
          trailerKey: await fetchTrailer(it.id, it.media_type),
        }))
      );
      const rest = pool.slice(5);
      setItems([...first, ...rest]);
      setLoading(false);
    });
  }, []);

  // Fetch trailers lazily for items near the active index
  const ensureTrailersLoaded = useCallback(
    async (from: number, count: number) => {
      const slice = items.slice(from, from + count);
      const updates = await Promise.all(
        slice.map(async (it, idx) => {
          if (it.trailerKey) return null;
          const key = await fetchTrailer(it.id, it.media_type);
          return { index: from + idx, trailerKey: key };
        })
      );
      const patches = updates.filter(Boolean) as {
        index: number;
        trailerKey: string | null;
      }[];
      if (patches.length === 0) return;

      setItems((prev) => {
        const copy = [...prev];
        for (const p of patches) {
          copy[p.index] = { ...copy[p.index], trailerKey: p.trailerKey };
        }
        return copy;
      });
    },
    [items]
  );

  // Load more when nearing the end
  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const pool = await buildShortsPool();
    // Exclude already-shown IDs
    const existing = new Set(items.map((i) => `${i.media_type}-${i.id}`));
    const fresh = pool.filter(
      (i) => !existing.has(`${i.media_type}-${i.id}`)
    );
    setItems((prev) => [...prev, ...fresh.slice(0, 10)]);
    setLoadingMore(false);
  }, [items, loadingMore]);

  // Observer to track active card
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
            // Preload next 3
            ensureTrailersLoaded(idx + 1, 3);
            // Trigger load-more when within 3 of the end
            if (idx >= items.length - 3) {
              loadMore();
            }
          }
        }
      },
      { threshold: 0.6, root: container }
    );

    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [items, ensureTrailersLoaded, loadMore]);

  if (loading) {
    return (
      <main className="fixed inset-0 z-40 flex items-center justify-center bg-black">
        <p className="text-sm text-white/60">Loading shorts…</p>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className="fixed inset-0 z-40 h-screen w-screen snap-y snap-mandatory overflow-y-scroll overscroll-contain bg-black scrollbar-hide"
    >
      {items.map((item, i) => (
        <div
          key={`${item.media_type}-${item.id}`}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          data-index={i}
          className="h-screen w-full"
        >
          {item.trailerKey ? (
            <ShortsPlayer
              item={item}
              active={activeIndex === i}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
              onNeedMore={() => {
                if (i >= items.length - 3) loadMore();
              }}
            />
          ) : (
            <div className="flex h-screen w-full items-center justify-center bg-black">
              <p className="text-sm text-white/40">No trailer available</p>
            </div>
          )}
        </div>
      ))}

      {loadingMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-xs text-white/70 backdrop-blur-sm"
        >
          Loading more…
        </motion.div>
      )}
    </main>
  );
}