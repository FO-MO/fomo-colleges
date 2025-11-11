"use client";

import React from "react";

interface PartnershipCardProps {
  name: string;
  location: string;
  verified: boolean;
  badge: string;
  tier: string;
  placementRate: number;
  avgPackage: string;
  students: string;
  placementTrend: number[];
  packageGrowth: number[];
  activeJobs: number;
  rating: number;
}

export default function PartnershipCard({
  name,
  location,
  verified,
  badge,
  tier,
  placementRate,
  avgPackage,
  students,
  placementTrend,
  packageGrowth,
  activeJobs,
  rating,
}: PartnershipCardProps) {
  const maxPlacementValue = Math.max(...placementTrend);
  const maxPackageValue = Math.max(...packageGrowth);

  // Badge color mapping
  const getBadgeColors = (badgeType: string) => {
    switch (badgeType.toLowerCase()) {
      case "bronze":
        return "bg-orange-100 text-orange-700 border border-orange-300";
      case "gold":
        return "bg-yellow-100 text-yellow-700 border border-yellow-400";
      case "platinum":
        return "bg-slate-100 text-slate-700 border border-slate-400";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {name.charAt(0)}
        </div>

        {/* College Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
            {verified && (
              <svg
                className="w-4 h-4 text-blue-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{location}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${getBadgeColors(
              badge
            )}`}
          >
            {badge}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
            {tier}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {placementRate}%
          </div>
          <p className="text-xs text-gray-500">Placement Rate</p>
          <div className="h-1 bg-teal-700 rounded-full mt-1"></div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{avgPackage}</div>
          <p className="text-xs text-gray-500">Avg Package</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{students}</div>
          <p className="text-xs text-gray-500">Students</p>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Placement Trend */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">
              Placement Trend
            </span>
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="flex items-end gap-1 h-12">
            {placementTrend.map((value, idx) => (
              <div
                key={idx}
                className="flex-1 bg-green-500 rounded-t"
                style={{
                  height: `${(value / maxPlacementValue) * 100}%`,
                  minHeight: "8px",
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Package Growth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">
              Package Growth
            </span>
            <svg
              className="w-4 h-4 text-teal-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="flex items-end gap-1 h-12">
            {packageGrowth.map((value, idx) => (
              <div
                key={idx}
                className="flex-1 bg-teal-700 rounded-t"
                style={{
                  height: `${(value / maxPackageValue) * 100}%`,
                  minHeight: "8px",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <span>{activeJobs} Active Jobs</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <svg
              className="w-4 h-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{rating}/5</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm font-semibold hover:bg-teal-800 transition-colors">
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}
