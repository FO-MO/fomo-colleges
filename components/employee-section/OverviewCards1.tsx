"use client";

import React from "react";
import { fetchFromBackend } from "@/lib/tools";

const res = await fetchFromBackend("overview-card1s?populate=*");
console.log(res[0].data.name); //this is how you take json type from backend

export default function OverviewCards1() {
  // Function to get color based on match score (0 = red, 50 = yellow, 100 = green)
  const getScoreColor = (score: number) => {
    if (score < 50) {
      // Red to Yellow (0-50)
      const ratio = score / 50;
      const red = 200;
      const green = Math.round(ratio * 200);
      return `rgb(${red}, ${green}, 0)`;
    } else {
      // Yellow to Green (50-100)
      const ratio = (score - 50) / 50;
      const red = Math.round(200 * (1 - ratio));
      const green = 200;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  const colleges = res.slice(0, 2).map((item: any) => ({
    name: item.data?.name,
    location: item.data?.location,
    matchScore: item.data?.matchScore,
    aiRecommended: item.data?.aiRecommended,
    whyRecommended: item.data?.whyRecommended,
    stats: item.data?.stats,
    skills: item.data?.skills,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {colleges.map((college, index) => (
        <div
          key={index}
          className="flex-1 bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 group"
        >
          {/* Linear Gradient Overlay - Top Left to Bottom Right */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-2xl pointer-events-none"></div>

          {/* Content - with relative positioning to stay above gradient */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {college.aiRecommended && (
                  <div className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 text-xs font-medium text-yellow-800 mb-2">
                    <span>✨</span>
                    <span>AI Recommended</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {college.name}
                </h3>
                <p className="text-sm text-gray-600">{college.location}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {college.matchScore}%
                </div>
                <p className="text-xs text-gray-500">Match Score</p>
                <div
                  className="mt-1 h-1 rounded-full"
                  style={{
                    width: `${college.matchScore}%`,
                    backgroundColor: getScoreColor(college.matchScore),
                  }}
                ></div>
              </div>
            </div>

            {/* Why Recommended */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  🎯 Why Recommended
                </span>
              </div>
              <ul className="space-y-1">
                {college.whyRecommended.map((reason, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-gray-600 flex items-start"
                  >
                    <span className="mr-2">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="flex justify-between gap-4 mb-4 bg-gray-50 rounded-lg p-3">
              {Object.values(college.stats).map((stat, idx) => (
                <div key={idx} className="text-center flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Top Skills Available
              </p>
              <div className="flex flex-wrap gap-2">
                {college.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 cursor-pointer py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                View Details
              </button>
              <button className="flex-1 cursor-pointer py-2.5 bg-[#0f4f4a] text-white rounded-lg text-sm font-semibold hover:bg-[#0a3a36] transition-colors flex items-center justify-center gap-2">
                <span className="opacity-2">⚡</span>
                Quick Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
