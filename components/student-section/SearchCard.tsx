"use client";

import React from "react";

export type Profile = {
  documentId?: string;
  id?: number;
  studentId: string;
  name: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  location?: string;
  skills?: string[];
  followers?: string[];
  following?: string[];
  isFollowing?: boolean;
  avatarUrl?: string | null;
};

type Props = {
  profile: Profile;
  onFollowToggle?: (profileId: string | number) => void;
};

export default function SearchCard({ profile, onFollowToggle }: Props) {
  const handleFollowClick = () => {
    if (onFollowToggle) {
      onFollowToggle(profile.id || 0);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <article className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 relative h-[160px] flex flex-col">
      {/* Profile Header */}
      <div className="p-4 pb-3 flex-shrink-0">
        <div className="flex items-start gap-3">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          {/* Name, Email, and Follow Button */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate hover:text-teal-700 cursor-pointer">
                  {profile.name}
                </h3>
                <p className="text-gray-600 text-xs truncate">
                  {profile.email}
                </p>
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollowClick}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                  profile.isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Followers and Following Stats */}
            <div className="flex items-center gap-4 mt-2">
              <div className="text-xs">
                <span className="font-semibold text-gray-900">
                  {profile.followers?.length ?? 0}
                </span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-gray-900">
                  {profile.following?.length ?? 0}
                </span>
                <span className="text-gray-600 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="px-4 pb-4 flex-1 overflow-hidden">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 4 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{profile.skills.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
