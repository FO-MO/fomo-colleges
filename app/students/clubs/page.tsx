"use client";
import React from "react";
import ClubCard, { Club } from "@/components/student-section/ClubCard";
import { getAuthToken } from "@/lib/strapi/auth";
import { backendurl, fetchFromBackend } from "@/lib/tools";

const x = await fetchFromBackend("clubs?populate=*");
const mockClubs: Club[] = x.map((club: any) => {
  return {
    id: club.documentId,
    title: club.title,
    description: club.description,
    tags: club.skills,
    leader: { name: club.author, avatarUrl: null },
    membersCount: club.no_member,
    joined: club.join,
    imageUrl: `${backendurl}` + club.image.url,
    badge: "Expert-led",
    videos: club.videos.map((video: any) => `${backendurl}` + video.url) || [],
  };
});

export default function ClubsPage() {
  return (
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Clubs</h1>
            <p className="text-gray-600 mt-2">
              Join expert-led clubs to access curated learning resources
            </p>
          </div>

          <div className="ml-auto hidden sm:block">
            {/* placeholder for actions */}
          </div>
        </div>

        {/* search & filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                className="w-full border rounded-lg px-4 py-3 pl-10"
                placeholder="Search clubs..."
              />
              <div className="absolute left-3 top-3 text-gray-400">🔍</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select className="border rounded-lg px-4 py-3 bg-white">
              <option>Most Popular</option>
            </select>

            <select className="border rounded-lg px-4 py-3 bg-white">
              <option>All Topics</option>
            </select>
          </div>
        </div>

        {/* grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClubs.map((c) => (
            <ClubCard key={c.id} club={c} />
          ))}
        </div>
      </div>
    </main>
  );
}
