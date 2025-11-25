"use client";

import React, { useState, useEffect } from "react";
import CollegesSideBar from "@/components/bars/collegesSideBar";
import Navbar from "@/components/bars/Navbar";
import { fetchData } from "@/lib/strapi/strapiData";
import { useRouter } from "next/navigation";

type Student = {
  id: string;
  documentId?: string;
  name: string;
  email: string;
  department?: string;
  year?: string;
  status?: string;
  course?: string;
  graduationYear?: string;
  skills?: string[];
  avatarUrl?: string | null;
};

export default function CollegeStudents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("fomo_token");

        if (!token) {
          console.warn("No authentication token found");
          setStudents([]);
          return;
        }

        // First fetch the college profile to get the college name
        const collegeData = (await fetchData(
          token,
          "college-profiles?populate=*"
        )) as { data?: unknown[] } | null;

        let currentCollegeName = "";
        if (
          collegeData?.data &&
          Array.isArray(collegeData.data) &&
          collegeData.data.length > 0
        ) {
          // Assuming the first college profile belongs to the logged-in user
          currentCollegeName = localStorage.getItem("collegeName") || "";
          console.log("Current college name:", currentCollegeName);
        }

        if (!currentCollegeName) {
          console.warn("No college profile found");
          setStudents([]);
          return;
        }

        // Filter student profiles by college name
        const data = (await fetchData(
          token,
          `student-profiles?populate=*&filters[college][$eq]=${encodeURIComponent(
            currentCollegeName
          )}`
        )) as { data?: unknown[] } | null;
        console.log(data);

        if (data?.data && Array.isArray(data.data)) {
          const fetchedStudents: Student[] = data.data.map(
            (student: unknown) => {
              const studentData = student as Record<string, unknown>;
              return {
                id: studentData.id?.toString() || "",
                documentId: studentData.studentId as string,
                name: (studentData.name as string) || "Unknown Student",
                email: (studentData.email as string) || "No email",
                department:
                  (studentData.department as string) ||
                  (studentData.course as string),
                year:
                  (studentData.year as string) ||
                  (studentData.graduationYear as string),
                status: "Active",
                course: studentData.course as string,
                graduationYear: studentData.graduationYear as string,
                skills: (studentData.skills as string[]) || [],
                avatarUrl: (studentData.avatarUrl as string) || null,
              };
            }
          );
          console.log("changes", fetchedStudents);

          setStudents(fetchedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleProfileClick = (student: Student) => {
    if (student.documentId) {
      router.push(`/profile?userId=${student.documentId}`);
    }
  };
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen mt-6 sm:mt-16 bg-gray-50 overflow-x-hidden">
      <Navbar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
        fixed left-0 top-0 z-50 w-56 h-full transform transition-transform duration-300 ease-in-out sm:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
      >
        <CollegesSideBar active="students" />
      </div>

      <button
        className="fixed top-20 left-0 px-3 scale-110 z-[60] py-[3px] border-1 border-black/30 cursor-pointer rounded-br-2xl bg-white shadow-lg sm:hidden hover:bg-gray-50 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-5 h-5 text-black object-cover"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <main className="sm:ml-56 pt-20 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src="/icons/students.svg"
                alt="Students"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Student Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage & Track Students
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-blue-50 text-emerald-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Powered
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div> */}
        </div>

        {/* TABS */}
        {/* <div className="flex bg-white border-1 border-black/5 rounded-full overflow-x-auto gap-2 mb-8 py-1 -mx-4 px-4 sm:mx-0 sm:px-2 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-1 sm:px-2 py-1 flex-1 sm:py-2 cursor-pointer rounded-lg whitespace-nowrap text-sm sm:text-base font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md flex-shrink-0 scale-95 text-center ${
                  isActive
                    ? "bg-teal-800 text-white shadow-lg -translate-y-0.5"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div> */}

        {/* Student List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Students ({students.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-10 flex flex-col items-center text-center text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-10 flex flex-col items-center text-center text-gray-600">
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No students yet
              </h3>
              <p className="mt-2 max-w-xl text-gray-600">
                Looks like there are no students in your college yet. Invite
                students or import a list to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {student.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {student.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {student.email}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {student.department && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {student.department}
                                </span>
                              </div>
                            )}
                            {student.year && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{student.year}</span>
                              </div>
                            )}
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {student.status || "Active"}
                            </span>
                          </div>
                        </div>

                        {/* Skills */}
                        {student.skills && student.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {student.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                +{student.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => handleProfileClick(student)}
                        className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
