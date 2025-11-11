"use client";

import React, { useState, useMemo, useEffect } from "react";
import SearchCard, { Profile } from "@/components/student-section/SearchCard";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/strapi/strapiData";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [followingFilter, setFollowingFilter] = useState<
    "all" | "following" | "not-following"
  >("all");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("fomo_token");
        const data = await fetchData(token, "student-profiles?populate=*");

        const fetchedProfiles: Profile[] = data.data.map((search: any) => ({
          id: search.id,
          documentId: search.studentId,
          name: search.name,
          email: search.email || "No email",
          skills: search.skills || [],
          followers: search.followers || [],
          following: search.following || [],
          isFollowing: false,
          avatarUrl: null,
        }));

        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on search query and following filter
  const filteredProfiles = useMemo(() => {
    let filtered = profiles;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (profile: Profile) =>
          profile.name.toLowerCase().includes(query) ||
          profile.email?.toLowerCase().includes(query) ||
          profile.skills?.some((skill: string) =>
            skill.toLowerCase().includes(query)
          )
      );
    }

    // Filter by following status
    if (followingFilter === "following") {
      filtered = filtered.filter((profile: Profile) => profile.isFollowing);
    } else if (followingFilter === "not-following") {
      filtered = filtered.filter((profile: Profile) => !profile.isFollowing);
    }

    return filtered;
  }, [searchQuery, followingFilter, profiles]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleProfileClick = (profile: Profile) => {
    if (profile.documentId) {
      router.push(`/profile?userId=${profile.documentId}`);
    }
  };

  return (
    <main className="w-full px-6 sm:px-8 pt-10 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Find People</h1>
          </div>
        </div>

        {/* search & filters */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none px-4 py-3 pl-12 pr-10 transition-colors"
                placeholder="Search by name, email or skills..."
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFollowingFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  followingFilter === "all"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({profiles.length})
              </button>
              <button
                onClick={() => setFollowingFilter("following")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  followingFilter === "following"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Following (
                {profiles.filter((p: Profile) => p.isFollowing).length})
              </button>
              <button
                onClick={() => setFollowingFilter("not-following")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  followingFilter === "not-following"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Not Following (
                {profiles.filter((p: Profile) => !p.isFollowing).length})
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {searchQuery && (
              <span>
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProfiles.length}
                </span>{" "}
                result
                {filteredProfiles.length !== 1 ? "s" : ""} for &quot;
                {searchQuery}&quot;
              </span>
            )}
          </div>
        </div>

        {/* grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading profiles...</p>
            </div>
          ) : filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile: Profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile)}
                className="transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
              >
                <SearchCard
                  profile={profile}
                  onFollowToggle={(profileId) => {
                    console.log("Follow toggled for profile:", profileId);
                    // Here you would typically update the profile's following status
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
