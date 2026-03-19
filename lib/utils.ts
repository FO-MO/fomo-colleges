import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get a full image URL when storage paths are relative.
 * Supabase public URLs are already absolute, so they are returned as-is.
 */
export function getImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  // Absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${supabaseUrl}${url}`;
}
