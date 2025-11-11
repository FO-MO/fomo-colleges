"use client";

import React from "react";
import { useRouter } from "next/navigation";

export type Club = {
  id: string | number;
  title: string;
  description?: string;
  tags?: string[];
  leader?: {
    name: string;
    avatarUrl?: string | null;
  };
  membersCount?: number;
  joined?: boolean;
  imageUrl?: string | null;
  badge?: string;
  videos?: string[];
};

type Props = {
  club: Club;
};

export default function ClubCard({ club }: Props) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/students/clubs/${club.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="max-w-sm bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <div className="h-36 bg-gray-200 relative flex items-center justify-center">
        {club.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.imageUrl}
            alt={club.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-gray-400 text-sm">Image</div>
        )}

        {/* badge */}
        {club.badge && (
          <div className="absolute left-3 top-3 bg-emerald-700 text-white text-xs font-medium rounded-full px-3 py-1 shadow">
            {club.badge}
          </div>
        )}

        {/* joined pill */}
        <div className="absolute right-3 top-3">
          <div className="bg-white/90 text-sm rounded-full px-3 py-1 shadow text-gray-700">
            {club.joined ? "Joined" : "Join"}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="pr-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {club.title}
            </h3>
            <p className="text-gray-600 mt-3 text-sm line-clamp-3">
              {club.description}
            </p>
          </div>

          {/* optional action already shown as pill on image; keep space */}
        </div>

        <div className=" flex items-center justify-between  pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              {club.leader && club.leader.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={club.leader.avatarUrl}
                  alt={club.leader.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="text-sm text-gray-400">
                  {club.leader ? club.leader.name.charAt(0) : "?"}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-500">Led by</div>
              <div className="text-sm font-semibold text-gray-800">
                {club.leader?.name}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {club.membersCount ?? 0} members
          </div>
        </div>

        {club.tags && club.tags.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {club.tags.map((t) => (
                <div
                  key={t}
                  className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
