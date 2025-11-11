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
  GitCommit,
  Star,
  GitFork,
  Activity,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
}

interface CommitActivity {
  week: number;
  total: number;
  days: number[];
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  createdDate: string;
  owner: {
    name: string;
    avatarUrl?: string | null;
  };
  skills: string[];
  membersCount: number;
  imageUrl?: string | null;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([]);
  const [totalCommits, setTotalCommits] = useState<number>(0);
  const [readme, setReadme] = useState<string>("");
  const [projectDetails, setProjectDetails] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch project details
    const mockProject: ProjectDetails = {
      id: projectId,
      title: "Custom Memory Allocator",
      description:
        "Build a custom memory allocation and deallocation system similar to malloc and free. This project focuses on understanding low-level memory management, fragmentation issues, and performance optimization. Perfect for students interested in systems programming and operating systems.",
      githubUrl: "https://github.com/simonMat21/Visual-Learner",
      createdDate: "2024-10-15",
      owner: {
        name: "biyon binu",
        avatarUrl: null,
      },
      skills: [
        "C",
        "C++",
        "Pointers",
        "Memory Management",
        "Linked Lists",
        "OS Concepts",
      ],
      membersCount: 5,
      imageUrl: null,
    };

    setProject(mockProject);

    // Mock project details markdown
    const mockProjectDetails = `# Project Overview

This project is an ambitious undertaking to build a custom memory allocator from scratch, implementing functionality similar to C's malloc() and free() functions.

## Goals & Objectives

- **Learn low-level memory management** - Understand how operating systems handle memory allocation
- **Optimize performance** - Reduce fragmentation and improve allocation speed
- **Implement best practices** - Follow industry standards for memory management

## Technical Approach

### Phase 1: Basic Allocator
We'll start by implementing a simple bump allocator that allocates memory linearly. This will help us understand the fundamentals before moving to more complex strategies.

### Phase 2: Free List Implementation
Next, we'll implement a free list to track deallocated memory blocks and enable memory reuse.

### Phase 3: Coalescing
We'll add block coalescing to merge adjacent free blocks, reducing fragmentation.

## Learning Outcomes

By the end of this project, team members will:
1. Understand memory alignment and padding
2. Learn about different allocation strategies (first-fit, best-fit, worst-fit)
3. Gain experience with pointer arithmetic
4. Build debugging and testing skills

## Prerequisites

- Strong understanding of C/C++
- Familiarity with pointers and memory addresses
- Basic knowledge of operating system concepts
- Experience with debugging tools like GDB or Valgrind

## Timeline

| Week | Milestone | Status |
|------|-----------|--------|
| 1-2 | Design and planning | ✅ Complete |
| 3-4 | Basic allocator implementation | 🔄 In Progress |
| 5-6 | Free list and deallocation | ⏳ Upcoming |
| 7-8 | Optimization and testing | ⏳ Upcoming |

## Resources

- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [Memory Allocators 101](https://arjunsreedharan.org/post/148675821737/memory-allocators-101-write-a-simple-memory)
- [Writing a Memory Allocator](http://dmitrysoshnikov.com/compilers/writing-a-memory-allocator/)

## Contributing

We welcome contributions! Please check our GitHub issues for tasks that need help. Make sure to follow our coding standards and write tests for new features.

## Team Meetings

Weekly meetings every **Tuesday at 6 PM EST** on Discord. All members are expected to attend and share progress updates.`;

    setProjectDetails(mockProjectDetails);

    // Fetch GitHub data
    if (mockProject.githubUrl) {
      fetchGitHubData(mockProject.githubUrl);
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const fetchGitHubData = async (githubUrl: string) => {
    try {
      // Extract owner and repo from GitHub URL
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        setError("Invalid GitHub URL");
        setLoading(false);
        return;
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");

      // Fetch all data in parallel
      const [contributorsRes, repoRes, activityRes, commitsRes, readmeRes] =
        await Promise.all([
          fetch(
            `https://api.github.com/repos/${owner}/${cleanRepo}/contributors?per_page=10`
          ),
          fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`),
          fetch(
            `https://api.github.com/repos/${owner}/${cleanRepo}/stats/commit_activity`
          ),
          fetch(
            `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=1`
          ),
          fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
            headers: {
              Accept: "application/vnd.github.v3.raw",
            },
          }),
        ]);

      // Process contributors
      if (contributorsRes.ok) {
        const contributorsData = await contributorsRes.json();
        setContributors(contributorsData);
      }

      // Process repo stats
      if (repoRes.ok) {
        const repoData = await repoRes.json();
        setRepoStats({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          openIssues: repoData.open_issues_count,
          watchers: repoData.watchers_count,
        });
      }

      // Process commit activity
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        console.log("Commit activity data:", activityData);
        setCommitActivity(activityData);
      } else {
        console.log("Failed to fetch commit activity:", activityRes.status);
      }

      // Get total commits count from Link header
      if (commitsRes.ok) {
        const linkHeader = commitsRes.headers.get("Link");
        if (linkHeader) {
          const match = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (match) {
            setTotalCommits(parseInt(match[1]));
          }
        } else {
          // If no Link header, there's only one page, so count is < 30
          const commits = await commitsRes.json();
          setTotalCommits(commits.length);
        }
      }

      // Process README
      if (readmeRes.ok) {
        const readmeText = await readmeRes.text();
        setReadme(readmeText);
      }
    } catch (err) {
      console.error("Error fetching GitHub data:", err);
      setError("Could not load GitHub data");
    } finally {
      setLoading(false);
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

  const getMaxCommits = () => {
    if (commitActivity.length === 0) return 0;
    return Math.max(...commitActivity.map((week) => week.total));
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
              <span>{project.membersCount} members</span>
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

      {/* Repository Stats */}
      {repoStats && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">
              Repository Statistics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stars */}
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <Star className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {repoStats.stars.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Stars</div>
            </div>

            {/* Forks */}
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <GitFork className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {repoStats.forks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Forks</div>
            </div>

            {/* Commits */}
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <GitCommit className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {totalCommits > 0 ? `${totalCommits.toLocaleString()}+` : "N/A"}
              </div>
              <div className="text-sm text-gray-600 mt-1">Commits</div>
            </div>

            {/* Watchers */}
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {repoStats.watchers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Watchers</div>
            </div>
          </div>
        </div>
      )}

      {/* Commit Activity Graph */}

      {/* Contributors Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <GitCommit className="w-6 h-6 text-gray-700" />
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
        ) : contributors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No contributors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributors.map((contributor, index) => (
              <a
                key={contributor.login}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
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
                    {contributor.login}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <GitCommit className="w-4 h-4" />
                    <span className="font-medium text-teal-600">
                      {contributor.contributions.toLocaleString()}
                    </span>
                    <span>contributions</span>
                  </div>
                </div>

                <div className="text-gray-400 group-hover:text-teal-600 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Section */}
      {projectDetails && (
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
                {projectDetails}
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
