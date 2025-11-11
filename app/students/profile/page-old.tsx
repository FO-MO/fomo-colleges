"use client";

import { useState } from "react";
import ProfileProjectCard from "@/components/student-section/ProfileProjectCard";
import ProfileClubCard from "@/components/student-section/ProfileClubCard";
import ProfileInternshipCard from "@/components/student-section/ProfileInternshipCard";
import EditProfileModal from "@/components/student-section/EditProfileModal";

type TabKey = "projects" | "clubs" | "internships";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://tbs9k5m4-1337.inc1.devtunnels.ms";
const studentId = JSON.parse(
  localStorage.getItem("fomo_user") || "{}"
).documentId;

const authToken = localStorage.getItem("fomo_token");

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

if (authToken) {
  headers["Authorization"] = `Bearer ${authToken}`;
}

const data = await fetch(
  `${BACKEND_URL}/api/student-profiles?filters[studentId][$eq]=${studentId}&populate=*`,
  { method: "GET", headers }
).then((res) => res.json());
// If no profile exists, studentAttributes will be null
const studentAttributes = data?.data?.[0] ?? null;
console.log("Student Attributes:", studentAttributes);

const profileData = {
  name: studentAttributes.name,
  email: studentAttributes.email || "tester@gmail.com",
  initials: "SM",
  backgroundImageUrl:
    "https://images.ctfassets.net/nnkxuzam4k38/2SvDjcgyav5C1DOb79JKXl/d3b06db5bb6bdb4ab237f666b5b4980e/compute-ea4c57a4.png",
  profileImageUrl:
    `${BACKEND_URL}` + studentAttributes.profilePic.url ||
    "https://images.hitpaw.com/topics/3d/profile-photo-1.jpg",
  followers: studentAttributes.followers || 0,
  following: studentAttributes.following || 0,
  // New fields
  institution: studentAttributes.college || "NULL",
  major: studentAttributes.course || "NULL",
  graduationYear: studentAttributes.graduationYear || "NULL",
  location: studentAttributes.location || "NULL",
  bio: studentAttributes.about || "hi!",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Machine Learning",
    "UI/UX Design",
    "Docker",
    "AWS",
    "GraphQL",
    "TensorFlow",
  ],
  interests: [
    "Artificial Intelligence",
    "Web Development",
    "Startups",
    "Product Design",
    "Open Source",
    "Hackathons",
  ],
  tabs: [
    { key: "projects" as TabKey, label: "Projects" },
    { key: "clubs" as TabKey, label: "Clubs" },
    { key: "internships" as TabKey, label: "Internships" },
  ],
  projects: [
    {
      title: "EcoTrack Mobile App",
      description:
        "Building an app that helps users track and reduce their carbon footprint",
      status: "Active",
      tags: ["React Native", "UI/UX Design"],
    },
    {
      title: "College Resource Finder",
      description:
        "Web app that aggregates and organizes university resources for students",
      status: "Completed",
      tags: ["React", "Firebase", "Tailwind CSS"],
    },
  ],
  clubs: [
    {
      name: "AI Innovators",
      description: "Explore cutting-edge AI technologies with industry experts",
      tags: ["Artificial Intelligence", "Machine Learning"],
      badge: "Expert-led",
    },
    {
      name: "Product Design Lab",
      description:
        "Learn product design methodologies from Apple and Tesla designers",
      tags: ["Product Design", "UX"],
      badge: "Expert-led",
    },
  ],
  internships: [
    {
      role: "UI/UX Design Intern at Adobe",
      timeline: "Summer 2023",
      location: "San Francisco, CA",
      status: "Applied",
    },
    {
      role: "Frontend Developer Intern at Spotify",
      timeline: "Summer 2023",
      location: "Remote",
      status: "Applied",
    },
  ],
};

console.log("Profile Data:", profileData.profileImageUrl);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = (data: {
    name: string;
    email: string;
    profileImage: File | null;
    backgroundImage: File | null;
    institution: string;
    major: string;
    graduationYear: string;
    location: string;
    bio: string;
    skills: string[];
    interests: string[];
  }) => {
    // TODO: Implement API call to save profile data
    console.log("Saving profile:", data);
    setIsEditModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.projects.map((project, index) => (
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
            ))}
          </div>
        );
      case "clubs":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.clubs.map((club, index) => (
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
            ))}
          </div>
        );
      case "internships":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.internships.map((internship, index) => (
              <div
                key={internship.role}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <ProfileInternshipCard
                  role={internship.role}
                  timeline={internship.timeline}
                  location={internship.location}
                  status={internship.status}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

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
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Edit Profile
              </button>
              <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md border border-gray-200 transition-all duration-300">
                Share
              </button>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-200 hover:bg-teal-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
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
                    {profileData.internships.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex gap-1 bg-white rounded-xl p-1.5 shadow-md border border-gray-200">
            {profileData.tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-teal-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pb-16">{renderTabContent()}</div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentData={{
          name: profileData.name,
          email: profileData.email,
          profileImageUrl: profileData.profileImageUrl,
          backgroundImageUrl: profileData.backgroundImageUrl,
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
    </div>
  );
}
