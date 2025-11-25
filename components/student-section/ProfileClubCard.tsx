import React from "react";

type Props = {
  name: string;
  description: string;
  tags: string[];
  badge?: string | null;
};

export default function ProfileClubCard({
  name,
  description,
  tags,
  badge,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-gray-700 mt-1">{description}</p>
        </div>
        {badge && (
          <span className="px-4 py-1 rounded-full bg-[#185c5a] text-white text-sm font-semibold">
            {badge}
          </span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
