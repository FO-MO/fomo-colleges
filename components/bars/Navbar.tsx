"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [initials, setInitials] = useState<string>("U");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    // Compute initials from current user's name stored in localStorage
    try {
      const raw = localStorage.getItem("fomo_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Try common fields for name
        const name =
          (parsed && (parsed.name || parsed.username || parsed.email)) ||
          "User";
        // If email, strip domain
        const cleanedName =
          typeof name === "string" && name.includes("@")
            ? name.split("@")[0]
            : name;
        const words = String(cleanedName).trim().split(/\s+/).filter(Boolean);
        let computed = "U";
        if (words.length >= 2) {
          computed = `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
        } else if (words.length === 1) {
          // Fallback: use first two characters of the single word (or single char if short)
          const w = words[0];
          computed =
            (w[0] || "").toUpperCase() + ((w[1] || "").toUpperCase() || "");
        }
        if (computed) setInitials(computed);
      }
    } catch {
      // ignore and keep fallback
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-10 h-20 border-b border-white/40 bg-gradient-to-r from-[#cfd5df]/60 via-white/30 to-white/20 backdrop-blur-xl"
        role="banner"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="text-3xl font-semibold text-gray-900">
            FOOMO
          </Link>

          <div className="flex items-center gap-6 text-gray-700">
            {/* <Link href="/students/messages" className="relative">
              <svg
                aria-hidden="true"
                className="h-6 w-6 hover:text-gray-900 transition-colors cursor-pointer"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-teal-500"
                aria-hidden="true"
              />
            </Link>

            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg> */}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label="Open account menu"
              >
                {initials}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-base font-semibold text-gray-900">
                      My Account
                    </p>
                  </div>

                  {/* Log out */}
                  <div className="border-t border-gray-100 pt-1">
                    <Link
                      href="/auth/logout"
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Log out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
