"use client";
import PostCard, { Post } from "@/components/student-section/PostCard";
import { useEffect, useState } from "react";

// Access environment variables from .env.local
const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";

export type HomePageData = {
  user: {
    name: string;
    initials: string;
    greetingEmoji: string;
    subtitle: string;
  };
  composer: {
    placeholder: string;
    postLabel: string;
  };
  postsSectionTitle: string;
  posts: Post[];
};

export default function StudentsHomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nameVal, setNameVal] = useState("");
//fetching posts
  useEffect(() => {
    // Compute initials from current user's name stored in localStorage
    try {
      const raw = localStorage.getItem("fomo_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Try common fields for name
        const name =
          (parsed && (parsed.name || parsed.username || parsed.email)) ||
          "User";
        // If email, strip domain
        const cleanedName =
          typeof name === "string" && name.includes("@")
            ? name.split("@")[0]
            : name;
        setNameVal(cleanedName);
      }
    } catch {
      setNameVal("Something");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("fomo_token");
        const response = await fetch(
          `${STRAPI_URL}/api/posts?populate=*&sort=createdAt:desc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data = await response.json();
        const rawPosts = data.data || [];

        // Transform Strapi posts to match Post type
        const transformedPosts: Post[] = rawPosts.map((post: any) => {
          // Get user data
          const user = post.user || post.author || {};
          const userName = user.name || user.username || "Unknown User";
          const userInitials = userName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          // Get avatar URL
          const avatarUrl =
            user.avatar?.url || user.profilePic?.url
              ? `${STRAPI_URL}${user.avatar?.url || user.profilePic?.url}`
              : null;

          // Get images - handle both array and single image
          let images: string[] = post.media
            ? post.media.map((img: any) => `${STRAPI_URL}${img.url}`)
            : [];

          console.log("post media is", images);
          // let images: string[] = [];
          // if (post.media) {
          //   if (Array.isArray(post.media.data)) {
          //     images = post.media.data.map(
          //       (img: any) => `${STRAPI_URL}${img.attributes?.url || img.url}`
          //     );
          //   } else if (post.media.data) {
          //     images = [
          //       `${STRAPI_URL}${
          //         post.media.data.attributes?.url || post.media.data.url
          //       }`,
          //     ];
          //   } else if (Array.isArray(post.images)) {
          //     images = post.images.map(
          //       (img: any) =>
          //         `${STRAPI_URL}${
          //           img.url || img.attributes?.url || img.formats?.medium?.url
          //         }`
          //     );
          //   } else {
          //     images = [
          //       `${STRAPI_URL}${
          //         post.images.url ||
          //         post.images.attributes?.url ||
          //         post.images.formats?.medium?.url
          //       }`,
          //     ];
          //   }
          // }

          // Format date
          const createdAt = new Date(
            post.createdAt || post.publishedAt || Date.now()
          );
          const now = new Date();
          const diffInSeconds = Math.floor(
            (now.getTime() - createdAt.getTime()) / 1000
          );
          let postedAgo = "";

          if (diffInSeconds < 60) {
            postedAgo = "just now";
          } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            postedAgo = `${minutes} ${
              minutes === 1 ? "minute" : "minutes"
            } ago`;
          } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            postedAgo = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
          } else {
            const days = Math.floor(diffInSeconds / 86400);
            postedAgo = `${days} ${days === 1 ? "day" : "days"} ago`;
          }

          return {
            id:
              post.documentId.toString(),
            author: {
              name: userName,
              initials: userInitials,
              avatarUrl: avatarUrl,
              title: user.title || user.bio || user.course || undefined,
            },
            postedAgo: postedAgo,
            message: post.description || "",
            images: images.length > 0 ? images : undefined,
            stats: {
              likes: post.likes || post.likesCount || 0,
              comments: post.comments || post.commentsCount || 0,
              shares: post.shares || post.sharesCount || 0,
            },
            isLiked: post.isLiked || false,
            likedBy:post.likedBy,
          };
        });

        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);
  console.log(posts);
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        {/* Hero Header Section */}
        <header className="mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Welcome back, {nameVal}! 👋
            </h1>
            <p className="text-base text-black max-w-2xl">
              Share your achievements and connect with your network
            </p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Feed (2 cols on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Composer Card */}
            <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-black">
                  {nameVal[0]?.toUpperCase() || "X"}
                </div>
                <button
                  onClick={() =>
                    (window.location.href = "/students/posts/create")
                  }
                  className="flex-1 text-left"
                >
                  <div className="w-full min-h-[80px] border border-gray-300 hover:border-gray-500 text-gray-500 px-3 py-2 rounded-md flex items-start cursor-pointer transition-colors">
                    {"Post what's on your mind, " + nameVal + "?"}
                  </div>
                </button>
              </div>
            </section>

            {/* Feed Section */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-black">Posts</h2>
              <div className="flex flex-col gap-4">
                {posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post.id} post={post} user={nameVal} />)
                ) : (
                  <p className="text-gray-500">No posts yet</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Trending Section */}
            

            {/* Suggested Connections */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-black mb-3">
                Suggested People
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Alex Johnson", role: "Product Manager" },
                  { name: "Sarah Chen", role: "UX Designer" },
                  { name: "Mike Patel", role: "Full Stack Dev" },
                ].map((person, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-black text-sm">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-600">{person.role}</p>
                    </div>
                    <button className="px-3 py-1 text-xs font-medium rounded-md bg-black text-white hover:bg-gray-800 transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-black mb-3">
                Your Activity
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 rounded-md p-3 text-center">
                  <p className="text-xl font-semibold text-black">24</p>
                  <p className="text-xs text-gray-600">Connections</p>
                </div>
                <div className="bg-gray-100 rounded-md p-3 text-center">
                  <p className="text-xl font-semibold text-black">8</p>
                  <p className="text-xs text-gray-600">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
