// Strapi college profile helper functions
const STRAPI_URL =
  process.env.BACKEND_URL || "https://tbs9k5m4-1337.inc1.devtunnels.ms";

export interface CollegeProfile {
  documentId?: string;
  id?: number;
  collegeName: string;
  description: string;
  ranking: string;
  location: string;
  numberOfStudents: string;
  establishmentDate: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface CreateCollegeProfileData {
  collegeName: string;
  description: string;
  ranking?: string;
  location: string;
  numberOfStudents: string;
  establishmentDate: string;
}

/**
 * Fetch the first college profile (for the logged-in user)
 */
export async function getCollegeProfile(
  token: string
): Promise<CollegeProfile | null> {
  try {
    // First, fetch the current user's ID
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      console.error("Failed to fetch user info");
      return null;
    }

    const userData = await userRes.json();
    const userId = userData.id;

    // Now fetch college profiles filtered by the user's ID
    const res = await fetch(
      `${STRAPI_URL}/api/college-profiles?filters[user][id][$eq]=${userId}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched college profile:", json);
    // Return the first profile for this user
    return json?.data?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch college profile:", err);
    return null;
  }
}

/**
 * Fetch a specific college profile by documentId
 */
export async function getCollegeProfileById(
  token: string,
  userId: string
): Promise<CollegeProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/college-profiles?filters[userId][$eq]=${userId}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched college profile by ID:", json);
    return json?.data || null;
  } catch (err) {
    console.error("Failed to fetch college profile by ID:", err);
    return null;
  }
}

/**
 * Create a new college profile
 */
export async function createCollegeProfile(
  data: CreateCollegeProfileData,
  token: string
): Promise<CollegeProfile | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/college-profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      console.error("Failed to create college profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to create college profile:", err);
    return null;
  }
}

/**
 * Update an existing college profile
 */
export async function updateCollegeProfile(
  documentId: string,
  data: Partial<CreateCollegeProfileData>,
  token: string
): Promise<CollegeProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/college-profiles/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      }
    );
    if (!res.ok) {
      console.error("Failed to update college profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to update college profile:", err);
    return null;
  }
}

/**
 * Delete a college profile
 */
export async function deleteCollegeProfile(
  documentId: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/college-profiles/${documentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.ok;
  } catch (err) {
    console.error("Failed to delete college profile:", err);
    return false;
  }
}

/**
 * Check if a user has completed their college profile
 */
export async function hasCompletedCollegeProfile(
  token: string
): Promise<boolean> {
  const profile = await getCollegeProfile(token);
  if (!profile) return false;

  // Check if required fields are filled
  return !!(
    profile.collegeName &&
    profile.description &&
    profile.location &&
    profile.numberOfStudents &&
    profile.establishmentDate
  );
}
