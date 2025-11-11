"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Video = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  date: string;
  videoUrl?: string;
};

type VideoPlayerProps = {
  video: Video;
  onClose: () => void;
};

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              src={video.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Video URL not available</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="bg-gray-900 p-6 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white mb-3">{video.title}</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-sm text-white font-semibold shadow-sm">
                {video.author.avatarUrl ? (
                  <img
                    src={video.author.avatarUrl}
                    alt={video.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  video.author.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-white font-medium">{video.author.name}</p>
                <p className="text-gray-400 text-sm">{video.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
