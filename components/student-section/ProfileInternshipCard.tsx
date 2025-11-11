import React from "react";

type Props = {
  role: string;
  timeline: string;
  location: string;
  status: string;
};

export default function ProfileInternshipCard({
  role,
  timeline,
  location,
  status,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{role}</h2>
          <p className="text-gray-600 mt-2">
            {timeline} <span className="mx-1">•</span> {location}
          </p>
        </div>
        <span className="px-4 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
          {status}
        </span>
      </div>
    </div>
  );
}
