"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowRight,
  User,
  GraduationCap,
  MapPin,
  BookOpen,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { getAuthToken } from "@/lib/strapi/auth";
import { createStudentProfile } from "@/lib/strapi/profile";
import Link from "next/link";
import { uploadImage } from "@/lib/strapi/strapiData";
import { KERALA_COLLEGES } from "@/lib/tools";

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

// Generate years from current year to next 10 years
const currentYear = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 11 }, (_, i) => currentYear + i);

export default function SetupProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [backgroundImgFile, setBackgroundImgFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [backgroundImgPreview, setBackgroundImgPreview] = useState<string>("");

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Get user info from localStorage
    try {
      const userStr = localStorage.getItem("fomo_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.username) {
          setName(user.username);
        }
        if (user.email) {
          setEmail(user.email);
        }
      }
    } catch (err) {
      console.error("Failed to parse user data:", err);
    }
  }, [router]);

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

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImgChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage_ = async (
    file: File,
    token: string
  ): Promise<number | null> => {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
      const formData = new FormData();
      formData.append("files", file);
      console.log("Uploading file to Strapi:", formData.get("files"), formData);

      const uploadResponse = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error("Failed to upload image:", await uploadResponse.text());
        return null;
      }

      const uploadedFiles = await uploadResponse.json();
      if (uploadedFiles && uploadedFiles.length > 0) {
        return uploadedFiles[0].id;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!name.trim() || !email.trim()) {
          setError(
            "Name and email are required. Please log in again if missing."
          );
          return false;
        }
        return true;
      case 2:
        if (!institution.trim() || !major.trim() || !graduationYear.trim()) {
          setError("All education fields are required");
          return false;
        }
        return true;
      case 3:
        if (!bio.trim() || !location.trim()) {
          setError("Bio and location are required");
          return false;
        }
        return true;
      case 4:
        if (selectedSkills.length === 0) {
          setError("Please select at least one skill");
          return false;
        }
        if (selectedInterests.length === 0) {
          setError("Please select at least one interest");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError("");
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("You must be signed in to create a profile");
        setLoading(false);
        return;
      }

      // Get student ID from stored user
      let studentId: string | null = null;
      try {
        const userStr = localStorage.getItem("fomo_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          studentId = user?.documentId || user?.id || null;
        }
      } catch (err) {
        console.error("Failed to get student ID:", err);
      }

      if (!studentId) {
        setError("Failed to identify user. Please log in again.");
        setLoading(false);
        return;
      }

      // Create profile
      const profileData: any = {
        studentId,
        name,
        email,
        about: bio,
        college: institution,
        course: major,
        graduationYear,
        location,
        skills: selectedSkills,
        interests: selectedInterests,
        user: {
          connect: [studentId],
        },
        // ...(profilePicId && { profilePic: profilePicId }),
        // ...(backgroundImgId && { backgroundImage: backgroundImgId }),
      };

      const result = await createStudentProfile(profileData, token);

      if (result) {
        // Profile created successfully
        // Store profile completion flag
        localStorage.setItem("profile_completed", "true");
        console.log("Profile created:", result);
        if (profilePicFile) {
          uploadImage(
            token,
            "api::student-profile.student-profile",
            result.id ? result.id - 1 : undefined,
            "profilePic",
            profilePicFile
          );
        }
        if (backgroundImgFile) {
          uploadImage(
            token,
            "api::student-profile.student-profile",
            result.id ? result.id - 1 : undefined,
            "backgroundImg",
            backgroundImgFile
          );
        }

        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const r = await fetch(
          `${BACKEND_URL}/api/student-profile/${result.documentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                age: 12,
              },
            }),
          }
        );
        console.log("Updated profile with age:", r);

        // Redirect to students dashboard
        router.push("/students");
      } else {
        setError("Failed to create profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile creation error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Basic Information
              </h2>
              <p className="text-gray-600">Confirm your account details</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                readOnly
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Your name"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is your registered name and cannot be changed here
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Your email"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is your registered email and cannot be changed here
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Education
              </h2>
              <p className="text-gray-600">
                Tell us about your academic background
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution *
              </label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white cursor-pointer"
                required
              >
                <option value="">Select your college</option>
                {KERALA_COLLEGES.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Major/Course *
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Graduation Year *
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white cursor-pointer"
                required
              >
                <option value="">Select graduation year</option>
                {GRADUATION_YEARS.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                About You
              </h2>
              <p className="text-gray-600">Share more about yourself</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 resize-none"
                placeholder="Tell us about yourself, your interests, goals, and what you're passionate about..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Cambridge, MA"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Skills & Interests
              </h2>
              <p className="text-gray-600">Choose what describes you best</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Skills * ({selectedSkills.length} selected)
              </label>
              <div className="max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg p-4">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Interests * ({selectedInterests.length} selected)
              </label>
              <div className="max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg p-4">
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
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Profile Images
              </h2>
              <p className="text-gray-600">
                Add photos to personalize your profile (Optional)
              </p>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Picture
              </label>
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profilePicPreview ? (
                      <img
                        src={profilePicPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <User className="w-12 h-12 mb-2" />
                        <span className="text-xs">No photo</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                      id="profilePicInput"
                    />
                    <label
                      htmlFor="profilePicInput"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium cursor-pointer transition-colors shadow-md"
                    >
                      <Camera className="w-5 h-5" />
                      {profilePicPreview ? "Change Photo" : "Upload Photo"}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Background Image
              </label>
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="flex flex-col gap-4">
                  <div className="w-full h-48 rounded-lg bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {backgroundImgPreview ? (
                      <img
                        src={backgroundImgPreview}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-16 h-16 mb-3" />
                        <span className="text-sm font-medium">
                          No background image
                        </span>
                        <span className="text-xs">
                          Upload to customize your profile
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImgChange}
                      className="hidden"
                      id="backgroundImgInput"
                    />
                    <label
                      htmlFor="backgroundImgInput"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium cursor-pointer transition-colors shadow-md"
                    >
                      <ImageIcon className="w-5 h-5" />
                      {backgroundImgPreview
                        ? "Change Background"
                        : "Upload Background"}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p>
                These images are optional but help make your profile stand out!
                You can always add or change them later from your profile
                settings.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <Link href="/">
        <div className="w-full border-b border-gray-300 py-4 px-12">
          <h1 className="text-black text-3xl font-bold">FOOMO</h1>
        </div>
      </Link>

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Step {currentStep} of 5
              </span>
              <span className="text-sm font-semibold text-teal-700">
                {Math.round((currentStep / 5) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                  {!loading && <Check className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push("/students")}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip for now (you can complete this later)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
