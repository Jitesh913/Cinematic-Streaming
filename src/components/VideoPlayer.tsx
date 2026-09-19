"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { X, RefreshCw } from "lucide-react";

interface VideoPlayerProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  onClose?: () => void;
}

type Source = {
  id: string;
  label: string;
  url: string;
};

export function VideoPlayer({
  mediaId,
  mediaType,
  title,
  seasonNumber = 1,
  episodeNumber = 1,
  onClose,
}: VideoPlayerProps) {
  const sources = useMemo<Source[]>(() => {
    if (mediaType === "movie") {
      return [
        {
          id: "vidlink",
          label: "Server 1",
          url: `https://vidlink.pro/movie/${mediaId}`,
        },
        {
          id: "vidfast",
          label: "Server 2",
          url: `https://vidfast.vc/movie/${mediaId}?autoPlay=true`,
        },
        {
          id: "vidsrc",
          label: "Server 3",
          url: `https://vidsrc.sbs/embed/movie/${mediaId}`,
        },
      ];
    }

    return [
      {
        id: "vidlink",
        label: "Server 1",
        url: `https://vidlink.pro/tv/${mediaId}/${seasonNumber}/${episodeNumber}`,
      },
      {
        id: "vidfast",
        label: "Server 2",
        url: `https://vidfast.vc/tv/${mediaId}/${seasonNumber}/${episodeNumber}?autoPlay=true`,
      },
      {
        id: "vidsrc",
        label: "Server 3",
        url: `https://vidsrc.sbs/embed/tv/${mediaId}/${seasonNumber}/${episodeNumber}`,
      },
    ];
  }, [mediaId, mediaType, seasonNumber, episodeNumber]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const current = sources[sourceIndex];

  const switchTo = (index: number) => {
    setSourceIndex(index);
    setIframeKey((k) => k + 1);
  };

  const nextServer = () => {
    const next = (sourceIndex + 1) % sources.length;
    switchTo(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/50 hover:bg-red-600 text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title + server switcher */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/70 to-transparent p-4 md:p-6 pointer-events-none">
          <div className="flex flex-wrap items-start justify-between gap-3 pointer-events-auto pr-12">
            <div>
              <h2 className="text-lg font-semibold text-white line-clamp-1">
                {title}
              </h2>
              {mediaType === "tv" && (
                <p className="text-sm text-white/70 mt-1">
                  Season {seasonNumber} • Episode {episodeNumber}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {sources.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => switchTo(i)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    i === sourceIndex
                      ? "bg-red-600 text-white"
                      : "bg-white/15 text-white/80 hover:bg-white/25"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={nextServer}
                className="rounded-full p-1.5 bg-white/15 text-white/80 hover:bg-white/25"
                title="Next server"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Embed */}
        <iframe
          key={iframeKey}
          src={current.url}
          allowFullScreen
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ display: "block" }}
        />
      </motion.div>
    </motion.div>
  );
}