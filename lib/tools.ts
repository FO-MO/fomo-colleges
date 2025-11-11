"use client";

export async function fetchFromBackend(
  endpoint: string,
  {
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://tbs9k5m4-1337.inc1.devtunnels.ms",
    token = localStorage.getItem("fomo_token"),
    options = {},
  }: {
    backendUrl?: string;
    token?: string | null;
    options?: RequestInit;
  } = {}
) {
  try {
    const res = await fetch(`${backendUrl}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Fetched ${endpoint}:`, data.data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// POST request function for Strapi backend
export async function postFetchFromBackend(
  endpoint: string,
  payload: Record<string, unknown>,
  {
    backendUrl = process.env.NEXT_PUBLIC_STRAPI_URL ||
      "https://tbs9k5m4-1337.inc1.devtunnels.ms",
    token = localStorage.getItem("fomo_token"),
  }: {
    backendUrl?: string;
    token?: string | null;
  } = {}
) {
  try {
    console.log(`🚀 POST to ${endpoint}:`, payload);

    const res = await fetch(`${backendUrl}/api/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(`📡 Response from ${endpoint}:`, data);

    if (!res.ok) {
      console.error(`❌ POST failed for ${endpoint}:`, data);
      throw new Error(
        data.error?.message ||
          `Failed to POST to ${endpoint}: ${res.statusText}`
      );
    }

    console.log(`✅ Successfully posted to ${endpoint}:`, data.data);
    return data; // Return full response for POST requests
  } catch (error) {
    console.error(`💥 Error posting to ${endpoint}:`, error);
    throw error;
  }
}

export const backendurl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
