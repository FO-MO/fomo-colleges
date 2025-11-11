"use client";

export async function fetchData(
  token: string | null,
  endpoint: string
): Promise<any> {
  const res = await fetch(`${backendurl}/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export const backendurl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
