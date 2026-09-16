"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  onLoadMore: () => void,
  enabled: boolean = true
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, enabled]);

  return sentinelRef;
}