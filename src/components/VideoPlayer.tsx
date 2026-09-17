"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

interface VideoPlayerProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  onClose?: () => void;
}

export function VideoPlayer({
  mediaId,
  mediaType,
  title,
  seasonNumber = 1,
  episodeNumber = 1,
  onClose,
}: VideoPlayerProps) {
  // Build VidLink embed URL
  const embedUrl =
    mediaType === "movie"
      ? `https://vidlink.pro/movie/${mediaId}`
      : `https://vidlink.pro/tv/${mediaId}/${seasonNumber}/${episodeNumber}`;

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors hover:bg-red-600"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6 pointer-events-none z-30"
        >
          <h2 className="text-lg font-semibold text-white line-clamp-1">
            {title}
          </h2>
          {mediaType === "tv" && (
            <p className="text-sm text-white/70 mt-1">
              Season {seasonNumber} • Episode {episodeNumber}
            </p>
          )}
        </motion.div>

        {/* VidLink Embed - No Sandbox */}
        <iframe
          src={embedUrl}
          allowFullScreen
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ display: "block" }}
        />
      </motion.div>
    </motion.div>
  );
}