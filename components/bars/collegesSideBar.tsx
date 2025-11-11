"use client";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Item = {
  key: string;
  label: string;
  href?: string;
};

type Props = {
  active?: string;
  className?: string;
};

const items: Item[] = [
  { key: "dashboard", label: "Dashboard", href: "/colleges/dashboard" },
  { key: "students", label: "Students", href: "/colleges/students" },
  { key: "analytics", label: "Analytics", href: "/colleges/analytics" },
  { key: "placements", label: "Placements", href: "/colleges/placements" },
];

function Icon({ name }: { name: string }) {
  // Icons for colleges sidebar
  switch (name) {
    case "dashboard":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </svg>
      );
    case "students":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      );
    case "analytics":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      );
    case "placements":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2H6a2 2 0 002-2V6m0 0H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2z"
          />
        </svg>
      );
    case "recruiting":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      );
    case "reports":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "settings":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    case "support":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function CollegesSideBar({
  active = "dashboard",
  className = "",
}: Props) {
  const pathname = usePathname();

  const getKeyFromPath = useCallback(
    (p: string) => {
      if (!p) return active;

      // Handle root path
      if (p === "/" || p === "") return "dashboard";

      // Try to match routes - check if path starts with or matches the href
      const match = items.find((it) => {
        if (!it.href || it.href === "#") return false;
        // Exact match
        if (p === it.href) return true;
        // Path starts with the href (for nested routes)
        if (p.startsWith(it.href + "/")) return true;
        return false;
      });

      if (match) return match.key;
      return active;
    },
    [active]
  );

  const [current, setCurrent] = useState<string>(() =>
    getKeyFromPath(pathname)
  );

  // Update the active item when the pathname changes
  useEffect(() => {
    setCurrent(getKeyFromPath(pathname));
  }, [pathname, getKeyFromPath]);

  return (
    <aside
      className={`fixed left-0 z-40 w-56 h-[calc(100vh-5rem)] bottom-0 ${className}`}
      aria-label="Colleges Sidebar"
    >
      <div className="h-full bg-white border-r border-gray-200 text-gray-900 min-h-screen p-6">
        <div className="flex flex-col gap-3 mt-20">
          {items.map((it) => {
            const isActive = it.key === current;
            const isClickable = it.href && it.href !== "#";

            const content = (
              <>
                <span className={`p-1 ${isActive ? "bg-transparent" : ""}`}>
                  <Icon name={it.key} />
                </span>
                <span className="font-medium">{it.label}</span>
              </>
            );

            const className = `flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 ${
              isActive
                ? "bg-gradient-to-r from-[#0f4f4a] to-[#0a6a60] text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`;

            if (isClickable) {
              return (
                <Link key={it.key} href={it.href!} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <button key={it.key} className={className} disabled>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
