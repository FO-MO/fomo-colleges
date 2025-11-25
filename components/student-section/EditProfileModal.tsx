"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import { getAuthToken } from "@/lib/strapi/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Predefined options
const AVAILABLE_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Machine Learning",
  "UI/UX Design",
  "Docker",
  "AWS",
  "GraphQL",
  "TensorFlow",
  "MongoDB",
  "PostgreSQL",
  "Git",
  "Figma",
  "Flutter",
  "Swift",
  "Kotlin",
];

const AVAILABLE_INTERESTS = [
  "Artificial Intelligence",
  "Web Development",
  "Mobile Development",
  "Startups",
  "Product Design",
  "Open Source",
  "Hackathons",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity",
  "Blockchain",
  "Game Development",
  "IoT",
  "DevOps",
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    name: string;
    email: string;
    institution?: string;
    major?: string;
    graduationYear?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
  };
  onSave: (data: {
    name: string;
    email: string;
    institution: string;
    major: string;
    graduationYear: string;
    location: string;
    bio: string;
    skills: string[];
    interests: string[];
  }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentData,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentData.name);
  const [email] = useState(currentData.email);
  const [institution, setInstitution] = useState(currentData.institution || "");
  const [major, setMajor] = useState(currentData.major || "");
  const [graduationYear, setGraduationYear] = useState(
    currentData.graduationYear || ""
  );
  const [location, setLocation] = useState(currentData.location || "");
  const [bio, setBio] = useState(currentData.bio || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentData.skills || []
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentData.interests || []
  );

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = getAuthToken();
      if (!token) {
        alert("You must be signed in to update your profile.");
        return;
      }

      // Get studentId from stored user
      let studentId: string | null = null;
      try {
        const raw = localStorage.getItem("fomo_user");
        if (raw) {
          const parsed = JSON.parse(raw as string) as {
            documentId?: string;
            id?: string;
          };
          studentId = parsed?.documentId ?? parsed?.id ?? null;
        }
      } catch {
        // ignore parse errors
      }

      // Check for existing profile
      let recordId: string | null = null;
      if (studentId) {
        const q = `${BACKEND_URL}/api/student-profiles?filters[studentId][$eq]=${encodeURIComponent(
          studentId
        )}&populate=*`;
        const res = await fetch(q, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          const rec = json?.data?.[0];
          recordId = rec?.documentId ?? null;
        } else {
          console.warn("Failed to check existing profile", res.status);
        }
      }

      // Build payload for Strapi (do NOT include email to prevent changes)
      const payload: {
        name: string;
        about: string;
        college: string;
        course: string;
        graduationYear: string;
        location: string;
        skills: string[];
        interests: string[];
      } = {
        name,
        about: bio,
        college: institution,
        course: major,
        graduationYear,
        location,
        skills: selectedSkills,
        interests: selectedInterests,
      };

      // If record exists, try update. If update returns 404, fallback to create.
      if (recordId) {
        console.log({ data: payload });
        const updateRes = await fetch(
          `${BACKEND_URL}/api/student-profiles/${recordId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: payload }),
          }
        );

        if (!updateRes.ok) {
          const body = await updateRes.text();
          console.warn("Update failed", updateRes.status, body);
          if (updateRes.status === 404) {
            // fallback to create
            const createRes = await fetch(
              `${BACKEND_URL}/api/student-profiles`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: { ...payload, studentId } }),
              }
            );
            if (!createRes.ok) {
              console.error("Create fallback failed", await createRes.text());
              alert(
                "Failed to create profile after update failed. See console."
              );
              return;
            }
          } else {
            alert("Failed to update profile. See console for details.");
            return;
          }
        }
      } else {
        // No record -> create
        const createRes = await fetch(`${BACKEND_URL}/api/student-profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: { ...payload, studentId } }),
        });
        if (!createRes.ok) {
          console.error("Create failed", await createRes.text());
          alert("Failed to create profile. See console for details.");
          return;
        }
      }

      // call parent onSave so UI updates locally (still include email for UI)
      onSave({
        name,
        email,
        institution,
        major,
        graduationYear,
        location,
        bio,
        skills: selectedSkills,
        interests: selectedInterests,
      });
      // Close modal after save
      onClose();
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save profile. See console for details.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                placeholder="Email"
              />
              <p className="text-xs text-gray-500 mt-2">
                Email cannot be changed here. Contact support to update your
                email.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Massachusetts Institute of Technology"
              />
            </div>

            {/* Major and Graduation Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., 2026"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Cambridge, MA"
              />
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Skills ({selectedSkills.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interests Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Interests ({selectedInterests.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
