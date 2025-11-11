// Strapi profile helper functions
const STRAPI_URL =
  process.env.BACKEND_URL || "https://tbs9k5m4-1337.inc1.devtunnels.ms";

export interface StudentProfile {
  documentId?: string;
  id?: number;
  studentId: string;
  name: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  followers?: any[];
  following?: any[];
  profilePic?: any;
  backgroundImg?: any;
  createdAt?: string;
  updatedAt?: string;
  user?: any;
  projects?: any;
  clubs?: any;
  internships?: any;
}

export interface CreateProfileData {
  studentId: string;
  name: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  profilePic?: number; // Media ID
  backgroundImage?: number; // Media ID
}

/**
 * Fetch student profile by studentId (user's documentId or id)
 */
export async function getStudentProfile(
  studentId: string,
  token: string
): Promise<StudentProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/student-profiles?filters[studentId][$eq]=${encodeURIComponent(
        studentId
      )}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched student profile:", json);
    return json?.data?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch student profile:", err);
    return null;
  }
}

/**
 * Create a new student profile
 */
export async function createStudentProfile(
  data: CreateProfileData,
  token: string
): Promise<StudentProfile | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/student-profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      console.error("Failed to create profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to create student profile:", err);
    return null;
  }
}

/**
 * Update an existing student profile
 */
export async function updateStudentProfile(
  documentId: string,
  data: Partial<CreateProfileData>,
  token: string
): Promise<StudentProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/student-profiles/${documentId}`,
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
      console.error("Failed to update profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to update student profile:", err);
    return null;
  }
}

/**
 * Upload a file to Strapi
 */
export async function uploadFile(
  file: File,
  token: string
): Promise<{ id: number; url: string } | null> {
  try {
    console.log("Uploading file to Strapi:", file.name, file.type, file.size);

    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "Failed to upload file. Status:",
        res.status,
        "Response:",
        errorText
      );
      return null;
    }

    const json = await res.json();
    console.log("Upload response:", json);

    if (Array.isArray(json) && json[0]) {
      return { id: json[0].id, url: json[0].url };
    }

    console.error("Unexpected upload response format:", json);
    return null;
  } catch (err) {
    console.error("Failed to upload file:", err);
    return null;
  }
}

/**
 * Check if a user has completed their profile
 */
export async function hasCompletedProfile(
  studentId: string,
  token: string
): Promise<boolean> {
  const profile = await getStudentProfile(studentId, token);
  if (!profile) return false;

  // Check if required fields are filled
  return !!(
    profile.name &&
    profile.college &&
    profile.course &&
    profile.graduationYear &&
    profile.about
  );
}
