"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw, Plus } from "lucide-react";
import VideoPlayer from "@/components/student-section/VideoPlayer";
import UploadVideoModal from "@/components/student-section/UploadVideoModal";
import { fetchData } from "@/lib/strapi/strapiData";

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

type ClubDetails = {
  id: string;
  name: string;
  description: string;
  videos: Video[];
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ClubVideosPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.clubId as string;

  const [clubDetails, setClubDetails] = useState<ClubDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchClubVideos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("fomo_token");

        // Fetch specific club by documentId (clubId from URL)
        const result = await fetchData(token, `clubs/${clubId}?populate=*`);
        console.log("Fetched club data:", result);
        console.log(
          "Fetched club videos:",
          `${BACKEND_URL}${result.data.videos[0]?.url}`
        );

        // Transform the data to match our ClubDetails type
        const clubData = result.data;
        const transformedClub: ClubDetails = {
          id: clubData.documentId,
          name: clubData.title || "Club",
          description:
            clubData.description ||
            "Join expert-led clubs to access curated learning resources",
          videos:
            clubData.videos?.map((video: any, index: number) => ({
              id: video.id?.toString() || index.toString(),
              title: video.name || video.title || "Video",
              thumbnailUrl: video.thumbnail
                ? `${BACKEND_URL}${result.url}`
                : undefined,
              author: {
                name: clubData.author || "Unknown",
                avatarUrl: undefined,
              },
              date: video.createdAt
                ? new Date(video.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently",
              videoUrl: video.url ? `${BACKEND_URL}${video.url}` : undefined,
            })) || [],
        };

        setClubDetails(transformedClub);
      } catch (error) {
        console.error("Error fetching club videos:", error);
        // Fallback to mock data on error
        setClubDetails({
          id: clubId,
          name: "Python",
          description:
            "Join expert-led clubs to access curated learning resources",
          videos: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubVideos();
    }
  }, [clubId]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("fomo_token");

      const response = await fetch(
        `${BACKEND_URL}/api/clubs/${clubId}?populate=*`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch club data");
      }

      const result = await response.json();
      const clubData = result.data;

      const transformedClub: ClubDetails = {
        id: clubData.documentId,
        name: clubData.title || "Club",
        description:
          clubData.description ||
          "Join expert-led clubs to access curated learning resources",
        videos:
          clubData.videos?.map((video: any, index: number) => ({
            id: video.id?.toString() || index.toString(),
            title: video.name || video.title || "Video",
            thumbnailUrl: video.thumbnail
              ? `${BACKEND_URL}${video.thumbnail.url}`
              : undefined,
            author: {
              name: clubData.author || "Unknown",
              avatarUrl: undefined,
            },
            date: video.createdAt
              ? new Date(video.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently",
            videoUrl: video.url ? `${BACKEND_URL}${video.url}` : undefined,
          })) || [],
      };

      setClubDetails(transformedClub);
    } catch (error) {
      console.error("Error refreshing club videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadVideo = () => {
    setShowUploadModal(true);
  };

  const handleVideoUpload = async (videoData: {
    title: string;
    description: string;
    videoFile: File;
    thumbnailFile?: File;
  }) => {
    console.log("Video upload data:", videoData);
    alert("Video upload functionality - connect to your API");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!clubDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Club not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 sm:px-8 lg:px-16 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Clubs</h1>
          <p className="text-gray-500 text-sm">
            Join expert-led clubs to access curated learning resources
          </p>
        </div>

        {/* Back Button and Club Name */}
        <div className="mb-8 flex items-center gap-8">
          <button
            onClick={() => router.push("/students/clubs")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span className="text-sm font-medium">Back</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-900">
            {clubDetails.name}
          </h2>
        </div>

        {/* Video Lectures Section */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-900">Video Lectures</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            {/* <button
              onClick={handleUploadVideo}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Upload Video
            </button> */}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {clubDetails.videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>

        {/* Empty State */}
        {clubDetails.videos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No videos available yet</p>
            <button
              onClick={handleUploadVideo}
              className="mt-4 text-teal-700 hover:text-teal-800 font-medium"
            >
              Upload the first video
            </button>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Upload Video Modal */}
      {showUploadModal && clubDetails && (
        <UploadVideoModal
          clubName={clubDetails.name}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleVideoUpload}
        />
      )}
    </main>
  );
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-50">
            <div
              className={`transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            >
              <svg
                className="w-20 h-20 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          </div>
        )}

        {/* Play button overlay on hover */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110">
            <svg
              className="w-6 h-6 text-teal-700 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="text-base font-semibold text-gray-900 mb-4 line-clamp-2 min-h-[3rem]">
          {video.title}
        </h4>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs text-white font-semibold shadow-sm">
              {video.author.avatarUrl ? (
                <img
                  src={video.author.avatarUrl}
                  alt={video.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                video.author.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-gray-700 font-medium text-sm">
              {video.author.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium">{video.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
