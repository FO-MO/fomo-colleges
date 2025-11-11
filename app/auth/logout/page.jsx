"use client";

import React, { useState } from "react";
import { removeAuthToken } from "@/lib/strapi/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    removeAuthToken();
    try {
      localStorage.removeItem("fomo_user");
    } catch {}

    // Add a small delay for better UX
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen w-screen flex flex-col">
        <Link href="/">
          <div className="w-full border-b border-gray-300 py-4 px-12">
            <h1 className="text-black text-3xl font-bold">FOOMO</h1>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Signing out...
            </h2>
            <p className="text-gray-600">Please wait while we log you out.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Link href="/">
        <div className="w-full border-b border-gray-300 py-4 px-12">
          <h1 className="text-black text-3xl font-bold">FOOMO</h1>
        </div>
      </Link>

      {/* Centered logout confirmation */}
      <div className="flex flex-1 scale-90 sm:scale-100 justify-center items-center">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-3">
            Log Out of Your Account?
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Are you sure you want to log out? You'll need to sign in again to
            access your account.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200"
            >
              Yes, Log Out
            </button>
            <button
              onClick={handleCancel}
              className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Your data will be saved and available when you log back in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
