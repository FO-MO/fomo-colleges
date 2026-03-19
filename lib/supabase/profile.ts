import { getImageUrl } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

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
  id?: string;
  user_id?: string;
  email: string;
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
  studentId?: string;
  name: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
}

export interface CollegeProfile {
  id?: string;
  collegeName: string;
  description: string;
  ranking: string;
  location: string;
  numberOfStudents: string;
  establishmentDate: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCollegeProfileData {
  collegeName: string;
  description: string;
  ranking?: string;
  location: string;
  numberOfStudents: string;
  establishmentDate: string;
}

type StudentProfileRow = {
  id?: string;
  user_id?: string;
  student_id?: string;
  name?: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduation_year?: number | string | null;
  location?: string;
  skills?: string[] | null;
  interests?: string[] | null;
  background_img?: string | null;
  profile_pic?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ProjectRow = {
  title?: string;
  description?: string;
  skills?: string[] | null;
};

type ClubRow = {
  title?: string;
  description?: string;
  skills?: string[] | null;
};

export type StudentListRow = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  course: string | null;
  graduation_year: number | null;
  skills: string[] | null;
  cgpa?: number | null;
};

function mapStudentRowToProfile(row: StudentProfileRow): StudentProfile {
  const name = row?.name || "User";
  const words = String(name).split(" ").filter(Boolean);
  const initials = words.length >= 2
    ? `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase()
    : String(name).slice(0, 2).toUpperCase() || "U";

  return {
    id: row?.id,
    user_id: row?.user_id,
    studentId: row?.student_id || row?.user_id || "",
    name,
    initials,
    email: row?.email || "",
    about: row?.about || "",
    bio: row?.about || "",
    college: row?.college || "",
    institution: row?.college || "",
    course: row?.course || "",
    major: row?.course || "",
    graduationYear: row?.graduation_year?.toString?.() || "",
    location: row?.location || "",
    skills: Array.isArray(row?.skills) ? row.skills : [],
    interests: Array.isArray(row?.interests) ? row.interests : [],
    followers: 0,
    following: 0,
    backgroundImageUrl: getImageUrl(row?.background_img),
    profileImageUrl: getImageUrl(row?.profile_pic),
    projects: [],
    clubs: [],
    internships: [],
    createdAt: row?.created_at,
    updatedAt: row?.updated_at,
  };
}

export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapStudentRowToProfile(data);
}

export async function createStudentProfile(
  userId: string,
  data: CreateProfileData
): Promise<StudentProfile | null> {
  const payload = {
    user_id: userId,
    student_id: data.studentId || userId,
    name: data.name,
    email: data.email || null,
    about: data.about || null,
    college: data.college || null,
    course: data.course || null,
    graduation_year: data.graduationYear ? Number(data.graduationYear) : null,
    location: data.location || null,
    skills: data.skills || [],
    interests: data.interests || [],
  };

  const { data: created, error } = await supabase
    .from("student_profiles")
    .insert(payload)
    .select("*")
    .single();

  if (error || !created) {
    console.error("Failed to create student profile:", error?.message);
    return null;
  }

  return mapStudentRowToProfile(created);
}

export async function upsertStudentProfile(
  userId: string,
  data: CreateProfileData
): Promise<StudentProfile | null> {
  const existing = await getStudentProfile(userId);
  if (!existing) {
    return createStudentProfile(userId, data);
  }

  const { data: updated, error } = await supabase
    .from("student_profiles")
    .update({
      name: data.name,
      email: data.email || existing.email || null,
      about: data.about || null,
      college: data.college || null,
      course: data.course || null,
      graduation_year: data.graduationYear ? Number(data.graduationYear) : null,
      location: data.location || null,
      skills: data.skills || [],
      interests: data.interests || [],
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !updated) {
    console.error("Failed to update student profile:", error?.message);
    return null;
  }

  return mapStudentRowToProfile(updated);
}

export async function getStudentProfile_2(userId: string): Promise<StudentProfile | null> {
  const base = await getStudentProfile(userId);
  if (!base) return null;

  const { data: projectRows } = await supabase
    .from("projects")
    .select("title, description, skills")
    .eq("student_profile_id", base.id);

  const { data: author } = await supabase
    .from("authors")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  let clubs: StudentProfile["clubs"] = [];
  if (author?.id) {
    const { data: clubRows } = await supabase
      .from("clubs")
      .select("title, description, skills")
      .eq("author_id", author.id);

    clubs =
      clubRows?.map((club: ClubRow) => ({
        name: club.title || "Club",
        description: club.description || "",
        tags: Array.isArray(club.skills) ? club.skills : [],
        badge: null,
      })) || [];
  }

  return {
    ...base,
    projects:
      projectRows?.map((project: ProjectRow) => ({
        title: project.title || "Untitled",
        description: project.description || "",
        status: "Active",
        tags: Array.isArray(project.skills) ? project.skills : [],
      })) || [],
    clubs,
    internships: [],
  };
}

export async function getCollegeProfileById(
  userId: string
): Promise<CollegeProfile | null> {
  const { data, error } = await supabase
    .from("college_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    collegeName: data.college_name || "",
    description: data.description || "",
    ranking: data.ranking || "",
    location: data.location || "",
    numberOfStudents: data.number_of_students || "",
    establishmentDate: data.establishment_date || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createCollegeProfile(
  userId: string,
  data: CreateCollegeProfileData
): Promise<CollegeProfile | null> {
  const { data: created, error } = await supabase
    .from("college_profiles")
    .upsert(
      {
        user_id: userId,
        college_name: data.collegeName,
        description: data.description,
        ranking: data.ranking || null,
        location: data.location,
        number_of_students: data.numberOfStudents,
        establishment_date: data.establishmentDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (error || !created) {
    console.error("Failed to create college profile:", error?.message);
    return null;
  }

  return {
    id: created.id,
    userId: created.user_id,
    collegeName: created.college_name || "",
    description: created.description || "",
    ranking: created.ranking || "",
    location: created.location || "",
    numberOfStudents: created.number_of_students || "",
    establishmentDate: created.establishment_date || "",
    createdAt: created.created_at,
    updatedAt: created.updated_at,
  };
}

export async function updateCollegeProfile(
  profileId: string,
  data: Partial<CreateCollegeProfileData>
): Promise<CollegeProfile | null> {
  const { data: updated, error } = await supabase
    .from("college_profiles")
    .update({
      college_name: data.collegeName,
      description: data.description,
      ranking: data.ranking,
      location: data.location,
      number_of_students: data.numberOfStudents,
      establishment_date: data.establishmentDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error || !updated) {
    console.error("Failed to update college profile:", error?.message);
    return null;
  }

  return {
    id: updated.id,
    userId: updated.user_id,
    collegeName: updated.college_name || "",
    description: updated.description || "",
    ranking: updated.ranking || "",
    location: updated.location || "",
    numberOfStudents: updated.number_of_students || "",
    establishmentDate: updated.establishment_date || "",
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  };
}

export async function getStudentsByCollegeName(collegeName: string) {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("id, user_id, name, email, course, graduation_year, skills, cgpa")
    .eq("college", collegeName);

  if (error) {
    console.error("Failed to fetch students:", error.message);
    return [];
  }

  return (data || []) as StudentListRow[];
}

// Fetch job postings where the `colleges` jsonb array contains the college name.
export async function getJobPostingsForCollege(collegeName: string) {
  const { data, error } = await supabase
    .from("college_job_postings")
    .select("*");

  if (error) {
    console.error("Failed to fetch job postings:", error.message);
    return [];
  }

  const normalizedCollegeName = collegeName.trim().toLowerCase();

  return (data || []).filter((posting) => {
    const colleges = (posting as { colleges?: unknown }).colleges;
    if (!Array.isArray(colleges)) return false;

    return colleges.some((entry) => {
      if (typeof entry === "string") {
        return entry.trim().toLowerCase() === normalizedCollegeName;
      }

      if (entry && typeof entry === "object" && "college_name" in entry) {
        const collegeField = (entry as { college_name?: unknown }).college_name;
        return typeof collegeField === "string"
          ? collegeField.trim().toLowerCase() === normalizedCollegeName
          : false;
      }

      return false;
    });
  });
}

export async function updateStudentCgpa(studentProfileId: string, cgpa: number) {
  const { error } = await supabase
    .from("student_profiles")
    .update({ cgpa, updated_at: new Date().toISOString() } as Record<string, unknown>)
    .eq("id", studentProfileId);

  if (error) {
    console.error("Failed to update CGPA:", error.message);
    return false;
  }

  return true;
}
