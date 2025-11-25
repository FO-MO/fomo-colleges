// Strapi profile helper functions
import { getImageUrl } from "@/lib/utils";

const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface MediaFile {
  id: number;
  url: string;
  name: string;
}

export interface Project {
  title: string;
  description: string;
  status?: string;
  tags?: string[];
}

export interface Club {
  name: string;
  title: string;
  description: string;
  tags?: string[];
  badge?: string | null;
}

export interface Internship {
  company?: string;
  role: string;
  timeline?: string;
  location?: string;
  duration?: string;
  status?: string;
}

export interface StudentProfile {
  documentId?: string;
  email: string;
  id?: number;
  initials: string;
  name: string;
  studentId: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear: string;
  location: string;
  skills: string[];
  interests: string[];
  followers: number;
  following: number;
  institution: string;
  major: string;
  bio: string;
  backgroundImageUrl: string | null;
  profileImageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  projects: {
    title: string;
    description: string;
    status: string;
    tags?: string[];
  }[];
  clubs: {
    name: string;
    description: string;
    tags: string[];
    badge: string | null;
  }[];
  internships: Internship[];
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
    const res = await fetch(`${STRAPI_URL}/api/college-profiles?populate=*`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched college profile:", json);
    // Return the first profile (assuming one profile per user)
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
    return json?.data[0] || null;
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

/**
 * Fetch student profile by studentId (user's documentId or id)
 */
export async function getStudentProfile_2(
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
    const profile = json?.data?.[0];
    console.log("Fetched student profile:", profile);

    const data: StudentProfile = {
      studentId: profile.studentId || studentId,
      name: profile.user?.username || "User",
      initials: profile.user?.username
        ? profile.user.username
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U",
      email: profile.user?.email || "Not specified",
      about: profile.about || "No bio yet",
      bio: profile.bio || profile.about || "No bio yet",
      college: profile.college || "Not specified",
      institution: profile.institution || profile.college || "Not specified",
      course: profile.course || "Not specified",
      major: profile.major || "Not specified",
      graduationYear: profile.graduationYear || "Not specified",
      location: profile.location || "Not specified",
      skills: profile.skills || [],
      interests: profile.interests || [],
      followers: typeof profile.followers === "number" ? profile.followers : 0,
      following: typeof profile.following === "number" ? profile.following : 0,
      backgroundImageUrl: getImageUrl(profile.backgroundImg?.url),
      profileImageUrl: getImageUrl(profile.profilePic?.url),
      projects:
        profile.projects?.map((proj: Project) => ({
          title: proj.title,
          description: proj.description,
          status: proj.status || "Active",
          tags: proj.tags || [],
        })) || [],
      clubs:
        profile.clubs?.map((club: Club) => ({
          name: club.title || club.name,
          description: club.description,
          tags: club.tags || [],
          badge: club.badge || null,
        })) || [],
      internships: profile.internships || [],
      user: profile.user,
      documentId: profile.documentId,
      id: profile.id,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };

    return data;
  } catch (err) {
    console.error("Failed to fetch student profile:", err);
    return null;
  }
}
