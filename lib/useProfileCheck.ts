"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken } from "@/lib/strapi/auth";
import { getStudentProfile } from "@/lib/strapi/profile";

/**
 * Hook to check if user has completed their profile
 * Redirects to setup-profile page if profile is incomplete
 * @param redirectIfIncomplete - Whether to redirect if profile is incomplete (default: true)
 */
export function useProfileCheck(redirectIfIncomplete: boolean = true) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      // Don't check on auth pages or setup-profile page
      const isAuthPage = pathname?.startsWith("/auth");
      if (isAuthPage) {
        setIsLoading(false);
        return;
      }

      const token = getAuthToken();
      if (!token) {
        // Not authenticated, redirect to login
        if (redirectIfIncomplete) {
          router.push("/auth/login");
        }
        setIsLoading(false);
        return;
      }

      // Get user ID from localStorage
      let studentId: string | null = null;
      try {
        const userStr = localStorage.getItem("fomo_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          studentId = user?.documentId || user?.id || null;
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }

      if (!studentId) {
        setIsLoading(false);
        setHasProfile(false);
        if (redirectIfIncomplete) {
          router.push("/auth/setup-profile");
        }
        return;
      }

      // Check if profile exists and is complete
      const profile = await getStudentProfile(studentId, token);

      const isComplete = !!(
        profile &&
        profile.name &&
        profile.college &&
        profile.course &&
        profile.graduationYear &&
        profile.about
      );

      setHasProfile(isComplete);
      setIsLoading(false);

      // Redirect to setup if incomplete
      if (!isComplete && redirectIfIncomplete) {
        router.push("/auth/setup-profile");
      }
    };

    checkProfile();
  }, [pathname, router, redirectIfIncomplete]);

  return { isLoading, hasProfile };
}

/**
 * Simple function to check if profile exists (non-hook version for server components)
 */
export async function checkProfileExists(
  studentId: string,
  token: string
): Promise<boolean> {
  try {
    const profile = await getStudentProfile(studentId, token);
    return !!(
      profile &&
      profile.name &&
      profile.college &&
      profile.course &&
      profile.graduationYear &&
      profile.about
    );
  } catch (err) {
    console.error("Failed to check profile:", err);
    return false;
  }
}
