import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the full image URL for both development and production
 * In development: URL is relative, so prepend BACKEND_URL
 * In production: URL is absolute (from CDN), so use as-is
 */
export function getImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  // If URL already starts with http:// or https://, it's absolute (production)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Otherwise, it's relative (development), so prepend BACKEND_URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  return `${backendUrl}${url}`;
}
