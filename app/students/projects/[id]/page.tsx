"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Github,
  Users,
  Calendar,
  User,
  Star,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { fetchData } from "@/lib/strapi/strapiData";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
const token = localStorage.getItem("fomo_token");
const res = await fetch(`${BACKEND_URL}/api/project-details?populate=*`, {
  headers: { Authorization: `Bearer ${token}` },
});
// const data = await res.json();

// console.log("Fetched projects:", data.data);

// const mockProject: ProjectDetails[] = data.data.map((project: any) => {
//   return {
//     id: project.documentId,
//     title: project.title,
//     description: project.description,
//     githubUrl: project.githubURL,
//     createdDate: project.date,
//     owner: {
//       name: project.Owner,
//       // avatarUrl:
//     },
//     skills: project.skills,
//     imageUrl: `${BACKEND_URL}${
//       project.image?.formats?.medium?.url || project.image?.url
//     }`,
//     contributors: project.contributors || [],
//     stats: {
//       stars: project.stars,
//       members: project.contributors.length || 0,
//     },
//     needHelp: project.needHelp?.map((item: any) => ({
//       title: item.title,
//       description: item.description,
//       skills: item.skills,
//     })),
//     detailsMarkdown: project.projectDetail,
//   };
// });

// Configuration: Set to true to fetch data from GitHub
const USE_GITHUB_DATA = false;

interface ProjectContributor {
  name: string;
  avatarUrl: string;
  profileUrl: string;
  role?: string;
  contributions?: number;
}

interface ProjectStats {
  stars: number;
  members: number;
}

interface NeedHelpItem {
  title: string;
  description: string;
  skills: string[];
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  createdDate: string;
  owner: {
    name: string;
    avatarUrl?: string | null;
  };
  skills: string[];
  imageUrl?: string | null;
  contributors: ProjectContributor[];
  stats: ProjectStats;
  needHelp: NeedHelpItem[];
  detailsMarkdown: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    func();
  }, [projectId]);

  const func = async () => {
    const response = await fetchData(token, `projects/${projectId}?populate=*`);
    console.log(response.data, projectId);
    const project = response.data.project_detail; // single object
    const formattedProject: ProjectDetails = {
      id: project.documentId,
      title: project.title,
      description: project.description,
      githubUrl: project.githubURL,
      createdDate: project.date,
      owner: { name: project.Owner },
      skills: project.skills || [],
      imageUrl: `${BACKEND_URL}${
        response.data.image.url || project.image?.url || ""
      }`,
      contributors: (response.data.contributors || []).map(
        (contributor: any) => ({
          name: contributor.name,
          avatarUrl: "/icons/Profile.svg",
          profileUrl: `/profile?userId=${contributor.studentId}`,
        })
      ),
      stats: {
        stars: project.stars || 0,
        members: project.contributors?.length + 1 || 0,
      },
      needHelp:
        project.needHelp?.map((item: any) => ({
          title: item.title,
          description: item.description,
          skills: item.skills,
        })) || [],
      detailsMarkdown: project.projectDetail || "",
    };
    setProject(formattedProject);

    setLoading(false);

    // If GitHub integration is enabled, fetch additional data
    if (USE_GITHUB_DATA && formattedProject.githubUrl) {
      fetchGitHubData(formattedProject.githubUrl);
    }
  };

  const fetchGitHubData = async (githubUrl: string) => {
    try {
      // Extract owner and repo from GitHub URL
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        setError("Invalid GitHub URL");
        return;
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");

      // Fetch GitHub stats
      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${cleanRepo}`
      );

      if (repoRes.ok) {
        const repoData = await repoRes.json();
        // Update project stats with GitHub data
        setProject((prev) =>
          prev
            ? {
                ...prev,
                stats: {
                  stars: repoData.stargazers_count,
                  members: prev.contributors.length,
                },
              }
            : null
        );
      }
    } catch (err) {
      console.error("Error fetching GitHub data:", err);
      setError("Could not load GitHub data");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!project) {
    return (
      <div className="w-full px-6 sm:px-8 pt-8 pb-16">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
      {/* Back Button */}
      <Link
        href="/students/projects"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 relative flex items-center justify-center">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/30 text-6xl font-bold">
              {project.title.charAt(0)}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-semibold text-gray-900">
                {project.owner.name}
              </span>
              <span>• Owner</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdDate)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{project.stats.members} members</span>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {project.description}
          </p>

          {/* GitHub Link */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          )}

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium text-sm border border-teal-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Stars */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <Star className="w-8 h-8 text-yellow-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {project.stats.stars}
            </div>
            <div className="text-sm text-gray-600 mt-1">Stars</div>
          </div>

          {/* Members */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {project.stats.members}
            </div>
            <div className="text-sm text-gray-600 mt-1">Members</div>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      {project.needHelp && project.needHelp.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Help Us with</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.needHelp.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium border border-orange-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contributors Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">Contributors</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading contributors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : project.contributors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No contributors yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.contributors.map((contributor, index) => (
              <Link
                key={contributor.name}
                href={contributor.profileUrl}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                      👑
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                    {contributor.name}
                  </h3>
                  {contributor.role && (
                    <p className="text-xs text-gray-500 mb-1">
                      {contributor.role}
                    </p>
                  )}
                  {contributor.contributions !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span className="font-medium text-teal-600">
                        {contributor.contributions}
                      </span>
                      <span>contributions</span>
                    </div>
                  )}
                </div>

                <div className="text-gray-400 group-hover:text-teal-600 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Section */}
      {project.detailsMarkdown && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">
              Project Details
            </h2>
          </div>

          <div className="prose prose-gray prose-lg max-w-none">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 pb-2 border-b-2 border-teal-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-teal-600 rounded"></span>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-4 ml-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-4 ml-4 list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-600">{children}</em>
                  ),
                  code: ({ inline, children, ...props }: any) =>
                    inline ? (
                      <code
                        className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm font-mono border border-teal-200"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4 shadow-inner"
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 rounded-lg overflow-x-auto my-4 shadow-lg">
                      {children}
                    </pre>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 underline font-medium hover:bg-teal-50 px-1 rounded transition-colors"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-teal-500 pl-4 py-2 italic text-gray-700 bg-teal-50/50 rounded-r my-4">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-lg shadow-md">
                      <table className="min-w-full border-collapse bg-white">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-teal-600 text-white">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-teal-500 px-4 py-3 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">
                      {children}
                    </td>
                  ),
                  hr: () => <hr className="my-6 border-t-2 border-gray-200" />,
                }}
              >
                {project.detailsMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
          Join Project
        </button>
        <button className="px-6 py-4 border-2 border-gray-300 hover:border-teal-600 text-gray-700 hover:text-teal-600 rounded-lg font-semibold transition-colors">
          Share
        </button>
      </div>
    </main>
  );
}
