"use client";
import React, { useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FiMapPin, FiDollarSign, FiCalendar } from "react-icons/fi";
import { fetchData } from "@/lib/strapi/strapiData";
import JobDetailsModal from "@/components/student-section/JobDetailsModal";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  description: string;
  tags: string[];
  type: string;
}

const token = localStorage.getItem("fomo_token");
const data = await fetchData(token, "jobs?populate=*");

const mockJobs: Job[] = data.data.map((job: any) => {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    postedDate: job.date,
    description: job.description,
    salary: job.salary,
    tags: job.skill,
    type: "internship",
  };
});

console.log("Fetched jobs:", mockJobs);

const employers = [
  {
    name: "Connect",
    joined: "Sep 12, 2025",
    description: "",
    tag: null,
    website: null,
  },
  {
    name: "uplyfto pvt ltd",
    joined: "Sep 12, 2025",
    description: "",
    tag: null,
    website: null,
  },
  {
    name: "Connect",
    joined: "Aug 3, 2025",
    description: "AI that automates in upskilling and networking",
    tag: "ed tech",
    website: null,
  },
  {
    name: "FOOMO",
    joined: "Jul 28, 2025",
    description: "AI that automates in upskilling and networking",
    tag: null,
    website: "#",
  },
];

export default function JobsPage() {
  const [tab, setTab] = useState<"jobs" | "employers">("jobs");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApply = () => {
    alert(
      `Application submitted for ${selectedJob?.title} at ${selectedJob?.company}!`
    );
    handleCloseModal();
  };

  return (
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
      <h1 className="text-3xl font-extrabold mb-6">Jobs & Employers</h1>
      <div className="flex gap-2 mb-8">
        <button
          className={`px-5 py-2 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-100 mr-2 ${
            tab === "jobs"
              ? "bg-white border-[#0f4f4a] text-black"
              : "bg-white border-[#f1f1f1] text-black"
          }`}
          onClick={() => setTab("jobs")}
        >
          Job Listings{" "}
          <span className="ml-1 text-gray-500">({mockJobs.length})</span>
        </button>
        <button
          className={`px-5 py-2 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-100 ml-2 ${
            tab === "employers"
              ? "bg-white border-[#0f4f4a] text-black"
              : "bg-white border-[#f1f1f1] text-black"
          }`}
          onClick={() => setTab("employers")}
        >
          Employers <span className="ml-1">(4)</span>
        </button>
      </div>

      {tab === "jobs" && (
        <div className="space-y-4">
          {mockJobs.map((job: Job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleJobClick(job)}
            >
              <div className="flex items-center gap-5 flex-1">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <HiOutlineBuildingOffice2 className="text-3xl text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-semibold">{job.title}</span>
                    <span className="text-gray-500 text-sm">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mb-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <FiMapPin /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      {"₹" + job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar /> Posted {job.postedDate}
                    </span>
                  </div>
                  <div className="mb-2 text-black line-clamp-2">
                    {job.description}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {job.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="bg-[#185c5a] hover:bg-[#134846] text-white px-7 py-3 rounded-xl font-semibold text-lg transition-colors flex-shrink-0 ml-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobClick(job);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "employers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employers.map((emp, idx) => (
            <div
              key={emp.name + idx}
              className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 flex flex-col min-h-[180px] justify-between"
            >
              <div className="flex items-center gap-5 mb-2">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <HiOutlineBuildingOffice2 className="text-3xl text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold">{emp.name}</span>
                    {emp.tag && (
                      <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium ml-2">
                        {emp.tag}
                      </span>
                    )}
                  </div>
                  {emp.description && (
                    <div className="text-black text-sm mb-1">
                      {emp.description}
                    </div>
                  )}
                  <div className="text-gray-500 text-sm">
                    Joined {emp.joined}
                  </div>
                </div>
              </div>
              {emp.website && (
                <a
                  href={emp.website}
                  className="mt-4 inline-block px-6 py-2 rounded-xl border border-[#e5e7eb] bg-white text-black font-semibold text-base text-center hover:bg-gray-50 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApply}
      />
    </main>
  );
}
