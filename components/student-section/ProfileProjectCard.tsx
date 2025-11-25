import React from "react";

type Props = {
  title: string;
  description: string;
  status: string;
  tags?: string[];
};

export default function ProfileProjectCard({
  title,
  description,
  status,
  tags,
}: Props) {
  const isActive = status.toLowerCase() === "active";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span
          className={`px-4 py-1 rounded-full font-semibold text-sm ${
            isActive ? "bg-[#185c5a] text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-gray-700 mb-3">{description}</p>
      <div className="flex gap-2 flex-wrap">
        {tags
          ? tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))
          : null}
      </div>
    </div>
  );
}
