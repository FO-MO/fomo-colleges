"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileProjectCard from "@/components/student-section/ProfileProjectCard";
import ProfileClubCard from "@/components/student-section/ProfileClubCard";
import ProfileInternshipCard from "@/components/student-section/ProfileInternshipCard";
import EditProfileModal from "@/components/student-section/EditProfileModal";
import { getAuthToken } from "@/lib/strapi/auth";
import {
  getStudentProfile,
  Project,
  Club,
  Internship,
  getStudentProfile_2,
} from "@/lib/strapi/profile";

type TabKey = "projects" | "clubs" | "internships";

interface ProfileData {
  name: string;
  email: string;
  initials: string;
  backgroundImageUrl: string | null;
  profileImageUrl: string | null;
  followers: number;
  following: number;
  institution: string;
  major: string;
  graduationYear: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
  // tabs: { key: TabKey; label: string }[];
  projects: {
    title: string;
    description: string;
    status: string;
    tags?: string[];
  }[];
  clubs: {
    name: string;
    description: string;
    tags: string[];
    badge: string | null;
  }[];
  internships: Internship[];
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Get userId from URL query
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // If no userId in URL, redirect to login or show error
      if (!userId) {
        router.push("/auth/login");
        return;
      }

      // Get current logged-in user ID to check if viewing own profile
      let currentUserId: string | null = null;
      try {
        const userStr = localStorage.getItem("fomo_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          currentUserId = user?.documentId || user?.id || null;
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }

      // Check if viewing own profile
      setIsOwnProfile(userId === currentUserId);

      // Transform profile data
      const data = await getStudentProfile_2(userId, token);
      if (!data) {
        setProfileData(null);
        setLoading(false);
        return;
      }
      setProfileData(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, router, isOwnProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveProfile = async () => {
    // The EditProfileModal already handles the save, so we just need to reload
    await loadProfile();
    setIsEditModalOpen(false);
  };

  const renderTabContent = () => {
    if (!profileData) return null;

    switch (activeTab) {
      case "projects":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.projects.length > 0 ? (
              profileData.projects.map(
                (project: {
                  title: string;
                  description: string;
                  status: string;
                  tags?: string[];
                }) => (
                  <div
                    key={project.title}
                    className="transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <ProfileProjectCard
                      title={project.title}
                      description={project.description}
                      status={project.status}
                      tags={project.tags}
                    />
                  </div>
                )
              )
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No projects yet</p>
              </div>
            )}
          </div>
        );
      case "clubs":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.clubs.length > 0 ? (
              profileData.clubs.map(
                (club: {
                  name: string;
                  description: string;
                  tags: string[];
                  badge: string | null;
                }) => (
                  <div
                    key={club.name}
                    className="transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <ProfileClubCard
                      name={club.name}
                      description={club.description}
                      tags={club.tags}
                      badge={club.badge}
                    />
                  </div>
                )
              )
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No clubs yet</p>
              </div>
            )}
          </div>
        );
      case "internships":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.internships.length > 0 ? (
              profileData.internships.map((internship: Internship) => (
                <div
                  key={internship.role}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                >
                  <ProfileInternshipCard
                    role={internship.role}
                    timeline={internship.timeline || "Not specified"}
                    location={internship.location || "Not specified"}
                    status={internship.status || "Not specified"}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No internships yet</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Failed to load profile</p>
          <button
            onClick={loadProfile}
            className="mt-4 px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Cover Image */}
      <div className="w-full h-48 relative overflow-hidden">
        {profileData.backgroundImageUrl ? (
          <>
            <img
              src={profileData.backgroundImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </>
        ) : (
          <>
            <div className="w-full h-full bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDQwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCA0MGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Avatar - positioned to overlap cover image */}
          <div className="relative -mt-20 mb-6">
            <div className="relative inline-block">
              {profileData.profileImageUrl ? (
                <img
                  src={profileData.profileImageUrl}
                  alt={profileData.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white border-4 border-white shadow-2xl">
                  {profileData.initials}
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Name, Info and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Name and Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {profileData.name}
              </h1>
              <p className="text-gray-600 text-base mb-3">
                @{profileData.email.split("@")[0]}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="text-sm font-bold text-gray-900">
                    {profileData.followers}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-600">Following</span>
                  <span className="text-sm font-bold text-gray-900">
                    {profileData.following}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                  <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md border border-gray-200 transition-all duration-300">
                    Share
                  </button>
                </>
              ) : (
                <>
                  <button className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    Follow
                  </button>
                  <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md border border-gray-200 transition-all duration-300">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bio and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profileData.bio && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {profileData.skills.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-200 hover:bg-teal-100 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {profileData.interests.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map(
                    (interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        {interest}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Education and Info */}
          <div className="space-y-6">
            {/* Education */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Education
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {profileData.institution}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {profileData.major}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Class of {profileData.graduationYear}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Location</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">
                  {profileData.location}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Projects</span>
                  <span className="text-sm font-bold text-teal-700">
                    {profileData.projects.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Clubs</span>
                  <span className="text-sm font-bold text-teal-700">
                    {profileData.clubs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Internships</span>
                  <span className="text-sm font-bold text-teal-700">
                    {profileData.internships?.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex gap-1 bg-white rounded-xl p-1.5 shadow-md border border-gray-200">
            {[
              { key: "projects" as TabKey, label: "Projects" },
              { key: "clubs" as TabKey, label: "Clubs" },
              { key: "internships" as TabKey, label: "Internships" },
            ].map((tab: { key: string; label: string }) => (
              <button
                key={tab.key}
                type="button"
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-teal-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.key as TabKey)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pb-16">{renderTabContent()}</div>
      </div>

      {/* Edit Profile Modal - Only show for own profile */}
      {profileData && isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentData={{
            name: profileData.name,
            email: profileData.email,
            institution: profileData.institution,
            major: profileData.major,
            graduationYear: profileData.graduationYear,
            location: profileData.location,
            bio: profileData.bio,
            skills: profileData.skills,
            interests: profileData.interests,
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
