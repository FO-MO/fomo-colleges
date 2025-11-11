"use client";

import React, { useState } from "react";
import ProjectCard, { Project } from "@/components/student-section/ProjectCard";
import CreateProjectModal from "@/components/student-section/CreateProjectModal";
import { fetchData } from "@/lib/strapi/strapiData";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
const token = localStorage.getItem("fomo_token");
const data = await fetchData(token, "projects?populate=*");

const mockProjects: Project[] = data.data.map((project: any) => {
  return {
    id: project.documentId,
    title: project.title,
    description: project.description,
    tags: ["Project"],
    creator: { name: project.author, avatarUrl: null },
    skills: project.skills,
    membersCount: project.no_member,
    // joined: project.join,
    imageUrl: project.image ? `${BACKEND_URL}${project.image.url}` : null,
    actions: [{ label: "Join Project", href: "#" }],
  };
});

console.log("Fetched projects:", mockProjects);

export default function StudentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
    githubUrl: string;
    coverImageUrl?: string;
    skills: string[];
    tags: string[];
  }) => {
    // TODO: Implement API call to create project
    // Example:
    // const response = await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(projectData)
    // });
    // if (response.ok) {
    //   // Refresh projects list
    // }

    console.log("Create project data:", projectData);
    alert("Project created! (Connect to your API)");
  };

  return (
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold">Projects</h1>
          <p className="text-gray-600 mt-2">
            Join or create projects to collaborate with other students
          </p>
        </div>

        <div className="ml-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#0f4f4a] text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#0d3f3b] transition-colors"
          >
            <span className="text-2xl">+</span>
            <span>Create Project</span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-4 items-center">
        <div className="flex-1">
          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Search projects..."
          />
        </div>

        <select className="border rounded-lg px-4 py-3">
          <option>Newest</option>
        </select>

        <select className="border rounded-lg px-4 py-3">
          <option>All Projects</option>
        </select>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreateProject={handleCreateProject}
        />
      )}
    </main>
  );
}
