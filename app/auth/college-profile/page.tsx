"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { KERALA_COLLEGES } from "@/lib/tools";

type CollegeProfile = {
  collegeName: string;
  description: string;
  ranking: string;
  location: string;
  numberOfStudents: string;
  establishmentDate: string;
};

export default function CollegeProfileSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CollegeProfile>({
    collegeName: "",
    description: "",
    ranking: "",
    location: "",
    numberOfStudents: "",
    establishmentDate: "",
  });

  //setting the profile
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //sending post req with axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("fomo_token");

      if (!token) {
        alert("Please login first");
        router.push("/auth/login");
        return;
      }

      // Use axios to send POST request to Strapi
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://tbs9k5m4-1337.inc1.devtunnels.ms";

      const response = await axios.post(
        `${backendUrl}/api/college-profiles`,
        {
          data: {
            collegeName: profile.collegeName,
            description: profile.description,
            ranking: profile.ranking,
            location: profile.location,
            numberOfStudents: profile.numberOfStudents,
            establishmentDate: profile.establishmentDate,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // If successful, navigate to college dashboard
      if (response.status === 200 || response.status === 201) {
        router.push("/colleges/dashboard");
      }
    } catch (error) {
      console.error("Error creating college profile:", error);
      alert("Failed to create college profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Setup College Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide your college information to complete the setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Name Dropdown */}
            <div>
              <label
                htmlFor="collegeName"
                className="block text-sm font-medium text-gray-700"
              >
                Select Your College *
              </label>
              <div className="mt-1">
                <select
                  id="collegeName"
                  name="collegeName"
                  required
                  value={profile.collegeName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white"
                >
                  <option value="">Choose your college...</option>
                  {KERALA_COLLEGES.map((college, index) => (
                    <option key={index} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                College Description *
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={profile.description}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Describe your college, its mission, and values..."
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location *
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={profile.location}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="City, State, Country"
                />
              </div>
            </div>

            {/* Ranking and Number of Students - Row Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ranking */}
              <div>
                <label
                  htmlFor="ranking"
                  className="block text-sm font-medium text-gray-700"
                >
                  National Ranking
                </label>
                <div className="mt-1">
                  <input
                    id="ranking"
                    name="ranking"
                    type="text"
                    value={profile.ranking}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="e.g. #15 or Top 20"
                  />
                </div>
              </div>

              {/* Number of Students */}
              <div>
                <label
                  htmlFor="numberOfStudents"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Students *
                </label>
                <div className="mt-1">
                  <input
                    id="numberOfStudents"
                    name="numberOfStudents"
                    type="number"
                    required
                    min="1"
                    value={profile.numberOfStudents}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
            </div>

            {/* Establishment Date */}
            <div>
              <label
                htmlFor="establishmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Establishment Date *
              </label>
              <div className="mt-1">
                <input
                  id="establishmentDate"
                  name="establishmentDate"
                  type="date"
                  required
                  value={profile.establishmentDate}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                } transition-colors`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Profile...
                  </>
                ) : (
                  "Create College Profile"
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              * Required fields. This information will be used to create your
              college&apos;s profile page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
