"use client";

import React, { useState } from "react";
import SubBar from "@/components/subBar";
import { fetchFromBackend, postFetchFromBackend } from "@/lib/tools";

const res = await fetchFromBackend("globaljobpostings?populate=*");
export default function JobPostingsPage() {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  //FORM DATA
  const [formData, setFormData] = useState({
    title: "",
    jobType: "Full Time",
    experience: "Entry Level",
    location: "",
    deadline: "",
    description: "",
    skills: [] as string[],
    requirements: [] as string[],
    benefits: [] as string[],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newReq, setNewReq] = useState("");
  const [newBen, setNewBen] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.title.trim().length < 5)
      newErrors.title = "Job title must be at least 5 characters";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.description.trim().length < 50)
      newErrors.description = "Job description must be at least 50 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //WRITE PAYLOAD
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Your Strapi collection only has ONE field called 'data' which is JSON YUUUHH THAS THE POINT
    const payload = {
      data: {
        data: {
          // This goes into your JSON field
          title: formData.title,
          jobType: formData.jobType,
          experience: formData.experience,
          location: formData.location,
          deadline: formData.deadline || null,
          description: formData.description,
          skills: formData.skills,
          requirements: formData.requirements,
          benefits: formData.benefits,
          status: "Active",
        },
      },
    };

    console.log(" Sending to JSON field:", JSON.stringify(payload, null, 2));

    try {
      // Use the new postFetchFromBackend function (FOR POST REQ)
      const result = await postFetchFromBackend("globaljobpostings", payload);

      console.log("Job posted successfully:", result);

      // Success - close modal and show toast
      setOpen(false);
      setShowToast(true);

      // Reset form data
      setFormData({
        title: "",
        jobType: "Full Time",
        experience: "Entry Level",
        location: "",
        deadline: "",
        description: "",
        skills: [],
        requirements: [],
        benefits: [],
      });

      // AUTO-REFRESH: Reload the page to show new job
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Small delay to show success toast first
    } catch (error) {
      console.error(" Error posting job:", error);
      alert(
        `Failed to post job: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const addItem = (
    field: "skills" | "requirements" | "benefits",
    value: string
  ) => {
    if (!value.trim()) return;
    setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    if (field === "skills") setNewSkill("");
    if (field === "requirements") setNewReq("");
    if (field === "benefits") setNewBen("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SubBar
          items={[
            { url: "/employers/overview", name: "Overview", logo: "👤" },
            {
              url: "/employers/applications",
              name: "Applications",
              logo: "📈",
            },
            {
              url: "/employers/partnerships",
              name: "College Partnerships",
              logo: "🎓",
            },
            { url: "/employers/jobpostings", name: "Job Postings", logo: "🧳" },
            // { url: "/employers/analytics", name: "Analytics", logo: "📊" },
          ]}
          className="mb-10"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Job Postings</h1>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2"
            >
              +<span>Post New Job</span>
            </button>
          </div>

          {/* Job Listings */}
          <div className="grid gap-6">
            {res.map((x) => {
              const job = x.data;
              return (
                <div
                  key={job.id}
                  className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>{job.jobType}</span>
                        <span>•</span>
                        <span>{job.experience}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>{job.applicants} applicants</span>
                      <span>
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      {job.deadline && (
                        <span>
                          Deadline {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-1">Post a New Job</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Fill out the details below to post a new job opening.
                </p>

                {/* Job Title */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="mt-1 w-full border rounded-md p-2"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Job Type / Experience */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Job Type</label>
                    <select
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.jobType}
                      onChange={(e) =>
                        setFormData({ ...formData, jobType: e.target.value })
                      }
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">
                      Experience Level
                    </label>
                    <select
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    >
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                  </div>
                </div>

                {/* Location / Deadline */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco, CA or Remote"
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">
                      Application Deadline (Optional)
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Job Description</label>
                  <textarea
                    placeholder="Describe the role, responsibilities, and what you’re looking for in a candidate..."
                    className="mt-1 w-full border rounded-md p-2 h-24"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="text-sm font-medium">
                    Skills Required (Optional)
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 border rounded-md p-2"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button
                      onClick={() => addItem("skills", newSkill)}
                      className="px-3 py-2 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <label className="text-sm font-medium">
                    Requirements (Optional)
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Add a requirement..."
                      className="flex-1 border rounded-md p-2"
                      value={newReq}
                      onChange={(e) => setNewReq(e.target.value)}
                    />
                    <button
                      onClick={() => addItem("requirements", newReq)}
                      className="px-3 py-2 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requirements.map((req, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 px-2 py-1 rounded text-sm"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <label className="text-sm font-medium">
                    Benefits (Optional)
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Add a benefit..."
                      className="flex-1 border rounded-md p-2"
                      value={newBen}
                      onChange={(e) => setNewBen(e.target.value)}
                    />
                    <button
                      onClick={() => addItem("benefits", newBen)}
                      className="px-3 py-2 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.benefits.map((ben, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 px-2 py-1 rounded text-sm"
                      >
                        {ben}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                  >
                    Post Job
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast */}
          {showToast && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md shadow-md">
              Job posted successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
