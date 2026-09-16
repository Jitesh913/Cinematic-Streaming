"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

export function TrailerModal({
  trailerKey,
  onClose,
}: {
  trailerKey: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {trailerKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video"
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="h-full w-full rounded-lg"
            />
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-sm text-muted transition-colors duration-300 hover:text-fg"
            >
              Close ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}