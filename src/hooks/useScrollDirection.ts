"use client";

import { useEffect, useState } from "react";

export function useScrollDirection(threshold = 80) {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const diff = y - lastY;

      // At the top — always show
      if (y < 20) {
        setHidden(false);
      }
      // Scrolling down past threshold — hide
      else if (diff > 5 && y > threshold) {
        setHidden(true);
      }
      // Scrolling up by a meaningful amount — show
      else if (diff < -5) {
        setHidden(false);
      }

      setLastY(y);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY, threshold]);

  return hidden;
}