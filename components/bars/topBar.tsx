"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getCurrentAuthUser, signOutSupabase } from "@/lib/supabase/auth";

type Props = {
  title?: string;
  theme?: "white" | "black" | "home";
  user?: User | null;
};

type User = {
  username: string;
  abbreviation: string;
  userType: "student" | "college" | "employer";
  loggedIn: boolean;
};

const DASHBOARD_ROUTES: Record<User["userType"], string> = {
  student: "/colleges/dashboard",
  college: "/colleges/dashboard",
  employer: "/colleges/dashboard",
};

export default function TopBar({
  title = "FOOMO",
  theme = "white",
  user = null,
}: Props) {
  

  // Manage auth state locally when top bar mounts
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(
    user ?? null
  );

  const computeAbbreviation = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (
      (parts[0][0] || "") + (parts[1][0] || parts[0][1] || "")
    ).toUpperCase();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const current = await getCurrentAuthUser();
        if (!mounted) return;
        if (current) {
          setAuthenticatedUser({
            username: current.username,
            abbreviation: computeAbbreviation(current.username),
            userType: (current.usertype as User["userType"]) || "student",
            loggedIn: true,
          });
          return;
        }

        // fallback to localStorage
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("fomo_user");
          if (raw) {
            const parsed = JSON.parse(raw);
            setAuthenticatedUser({
              username: parsed.username || "User",
              abbreviation:
                parsed.abbreviation || computeAbbreviation(parsed.username || parsed.email || "User"),
              userType: parsed.usertype || "student",
              loggedIn: true,
            });
            return;
          }
        }

        setAuthenticatedUser(null);
      } catch (err) {
        console.error("Failed to load auth user for TopBar:", err);
        setAuthenticatedUser(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  

  const isHomeTheme = theme === "home";
  const navbarClasses = isHomeTheme ? "" : "backdrop-blur-md";
  const backgroundStyle = isHomeTheme
    ? {
        backgroundColor: "#000",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }
    : {
        background:
          "linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.50))",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      };

  
  const greetingColor = theme === "black" ? "text-gray-900" : "text-white";

  return (
    <div
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 ${navbarClasses}`}
      style={backgroundStyle}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-13 w-13 items-center justify-center rounded-lg bg-[#d6ff3a] text-xl font-extrabold text-[#082926] shadow-[0_3px_0_rgba(0,0,0,0.12)]">
            F
          </div>
          <Link href="/">
            <span
              className={`${
                theme === "black" ? "text-black" : "text-white"
              } text-3xl font-semibold`}
            >
              {title}
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4" aria-label="Primary">
          {!authenticatedUser ? (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="transform rounded-2xl bg-[#d6ff3a] px-4 py-2 font-extrabold text-[#082926] shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="transform rounded-2xl bg-[#d6ff3a] px-4 py-2 font-extrabold text-[#082926] shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm font-semibold text-white">
                {authenticatedUser.abbreviation}
              </span>
              <span
                className={`rounded-2xl px-4 py-2 text-sm font-medium ${greetingColor}`}
              >
                Hi {authenticatedUser.username}!
              </span>
              <Link
                href={DASHBOARD_ROUTES[authenticatedUser.userType]}
                className="transform rounded-2xl bg-[#d6ff3a] px-4 py-2 font-extrabold text-[#082926] shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  try {
                    await signOutSupabase();
                  } catch (err) {
                    console.error("Failed to sign out:", err);
                  }
                  try {
                    localStorage.removeItem("fomo_user");
                  } catch {}
                  // redirect to home
                  window.location.href = "/";
                }}
                className="rounded-2xl px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
