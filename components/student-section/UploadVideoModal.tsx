"use client";

import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";

type UploadVideoModalProps = {
  clubName: string;
  onClose: () => void;
  onUpload: (videoData: {
    title: string;
    description: string;
    videoFile: File;
    thumbnailFile?: File;
  }) => void;
};

export default function UploadVideoModal({
  clubName,
  onClose,
  onUpload,
}: UploadVideoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoFile) {
      alert("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      // Call the parent's onUpload function with the form data
      await onUpload({
        title,
        description,
        videoFile,
        thumbnailFile: thumbnailFile || undefined,
      });

      // Close modal on success
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-12 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            Upload Video Lecture
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Share your knowledge with the {clubName} club members
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              className="w-full px-3 py-2 text-sm border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of your video"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          {/* Video File */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Video File
            </label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:text-gray-600"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-medium">
                {videoFile ? videoFile.name : "Click to select video"}
              </span>
            </button>
          </div>

          {/* Thumbnail (Optional) */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Thumbnail (Optional)
            </label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:text-gray-600"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-medium">
                {thumbnailFile
                  ? thumbnailFile.name
                  : "Click to select thumbnail"}
              </span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title || !description || !videoFile}
              className="px-5 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
