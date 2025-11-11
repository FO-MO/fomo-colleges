"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Item = {
  key: string;
  label: string;
  href?: string;
  icon?: string;
};

type Props = {
  active?: string;
  className?: string;
};

const items: Item[] = [
  { key: "home", label: "Home", href: "/students", icon: "/icons/home.svg" },
  {
    key: "projects",
    label: "Projects",
    href: "/students/projects",
    icon: "/icons/projects.svg",
  },
  {
    key: "clubs",
    label: "Clubs",
    href: "/students/clubs",
    icon: "/icons/Clubs.svg",
  },
  {
    key: "jobs",
    label: "Jobs",
    href: "/students/jobs",
    icon: "/icons/jobs.svg",
  },
  {
    key: "profile",
    label: "Profile",
    href: "/students/profile",
    icon: "/icons/Profile.svg",
  },
  {
    key: "messages",
    label: "Messages",
    href: "/students/messages",
    icon: "/icons/messages.svg",
  },
  {
    key: "search",
    label: "Search",
    href: "/students/search",
    icon: "/icons/search.svg",
  },
  {
    key: "copilot",
    label: "FOMO AI Copilot",
    href: "/students/ai",
    icon: "/icons/ai.svg",
  },
];

export default function SideBar({ active = "home", className = "" }: Props) {
  const pathname = usePathname();

  const getKeyFromPath = (p: string) => {
    if (!p) return "home";

    // Handle root path
    if (p === "/" || p === "") return "home";

    // Sort items by href length (descending) to match more specific routes first
    const sortedItems = [...items].sort((a, b) => {
      const lenA = a.href && a.href !== "#" ? a.href.length : 0;
      const lenB = b.href && b.href !== "#" ? b.href.length : 0;
      return lenB - lenA;
    });

    // Try to match routes - check if path starts with or matches the href
    const match = sortedItems.find((it) => {
      if (!it.href || it.href === "#") return false;
      // Exact match
      if (p === it.href) return true;
      // Path starts with the href (for nested routes)
      if (p.startsWith(it.href + "/")) return true;
      return false;
    });

    if (match) return match.key;
    return "home";
  };

  const [current, setCurrent] = useState<string>(() =>
    getKeyFromPath(pathname)
  );

  // Update the active item when the pathname changes
  useEffect(() => {
    const newKey = getKeyFromPath(pathname);
    setCurrent(newKey);
  }, [pathname]);

  return (
    <aside
      className={`hidden md:block fixed left-0 z-9 w-56 h-[calc(100vh-5rem)] ${className}`}
      aria-label="Sidebar"
    >
      <div className="h-full bg-[#192534] text-white min-h-screen p-6">
        <div className="flex flex-col gap-3 mt-20">
          {items.map((it) => {
            const isActive = it.key === current;
            const isClickable = it.href && it.href !== "#";

            const content = (
              <>
                <span className={`p-1 ${isActive ? "bg-transparent" : ""}`}>
                  {it.icon && (
                    <Image
                      src={it.icon}
                      alt={it.label}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  )}
                </span>
                <span className="font-medium">{it.label}</span>
              </>
            );

            const className = `flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 ${
              isActive
                ? "bg-gradient-to-r from-[#0f4f4a] to-[#0a6a60] text-white shadow-lg"
                : "text-white/90 hover:bg-white/3"
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
