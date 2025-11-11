"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SubBarItem = {
  url: string;
  name: string;
  logo: React.ReactNode;
};

type SubBarProps = {
  items: SubBarItem[];
  activeUrl?: string;
  className?: string;
};

export default function SubBar({
  items,
  activeUrl,
  className = "",
}: SubBarProps) {
  const pathname = usePathname();
  const current = activeUrl ?? pathname;

  return (
    <nav
      className={`w-full rounded-[28px] bg-[#f3f5f9] px-3 py-2 shadow-sm ${className}`}
      aria-label="Secondary"
    >
      <ul className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
        {items.map((item) => {
          const isActive =
            current === item.url || current.startsWith(`${item.url}/`);

          return (
            <li key={item.name} className="flex-1 min-w-[150px]">
              <Link
                href={item.url}
                className={`group flex items-center gap-2 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f4f4a] ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-slate-500 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                <span className="text-[18px] text-inherit transition-transform duration-200 group-hover:-translate-y-0.5">
                  {item.logo}
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
