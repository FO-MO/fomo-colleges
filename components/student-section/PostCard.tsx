"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  Loader2,
} from "lucide-react";

// Helper functions (moved outside component for consistency)
const getInitials = (name) => {
  return name ? name.split(/\s+/).map((n) => n[0]).join('') : '??';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// --- ENVIRONMENT & TYPES ---

// Environment variable handling
const STRAPI_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STRAPI_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BACKEND_URL) ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";

type PostAuthor = {
  name: string;
  initials: string;
  avatarUrl?: string | null;
  title?: string;
};

type PostStats = {
  likes: number;
  comments: number;
  shares?: number;
};

export type Post = {
  id: string;
  author: PostAuthor;
  postedAgo: string;
  message: string;
  images?: string[];
  stats: PostStats;
  isLiked?: boolean;
  likedBy?: string[];
};

type Props = {
  post: Post;
  user: string; // The currently logged-in user's identifier (email/username/ID)
};

// Type for the cleaned-up comment data used in state and rendering
type CommentData = {
  id: number;
  content: string;
  sentAt: string; // Formatted date string
  user: {
    name: string;
    initials: string;
    avatarUrl?: string;
  };
};

// Function to map the deeply nested Strapi API response into a flattened structure
const mapStrapiComment = (strapiComment) => {
  if (!strapiComment || !strapiComment.attributes) return null;

  const { id, attributes } = strapiComment;
  
  // *** FIX APPLIED HERE: Making access to commenterData more explicit ***
  // Access the relation field named 'user'
  const userRelation = attributes.user;
  
  // Check if the relation has a populated data object
  const commenterData = userRelation?.data?.attributes;

  // Use username or email for the name, as the default Strapi User usually doesn't have a 'name' field
  const username = commenterData?.username || commenterData?.email || 'User';
  
  // Derive initials from username
  const initials = getInitials(username);
  
  // Assuming no profile picture is available directly on the default User for now
  const avatarUrl = undefined; 

  return {
    id: id,
    content: attributes.content,
    sentAt: attributes.sentAt, // Still the raw string, will format in component
    user: {
      name: username,
      initials: initials,
      avatarUrl: avatarUrl ? `${STRAPI_URL}${avatarUrl}` : undefined,
    }
  };
};

// --- SUB COMPONENTS ---

const UserAvatar = ({ user }) => (
  user.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt={user.name}
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
      {user.initials.toUpperCase()}
    </div>
  )
);

// --- MAIN COMPONENT ---

export default function PostCard({ post, user }: Props) {
  // Get userId and token from localStorage (Changed from studentId to userId)
  let userId: string | number | null = null;
  const token = typeof window !== 'undefined' ? localStorage.getItem("fomo_token") : null;
  
  try {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("fomo_user") : null;
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      // PULLING DEFAULT STRAPI USER ID: This assumes the user ID is stored in parsedUser.id
      userId = parsedUser.id || null;
    }
  } catch (err) {
    console.error("Failed to parse user data:", err);
  }

  const { id, author, postedAgo, message, images, stats, likedBy } = post;
  const initialLikes = Number(stats.likes);
  const initialComments = Number(stats.comments);

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  // Using local state to track comment count for optimistic updates
  const [commentCount, setCommentCount] = useState(initialComments);
  const [showFullText, setShowFullText] = useState(false);
  const [likedUsers, setLikedUsers] = useState<string[]>(likedBy || []);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState<CommentData[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);

  // --- LIKE HANDLER ---
  const handleLike = async () => {
    // Determine action: like or unlike
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    let newLikedUsers = [...likedUsers];

    if (newIsLiked) {
      // Add user to list
      if (!newLikedUsers.includes(user)) {
        newLikedUsers.push(user);
      }
    } else {
      // Remove user from list
      newLikedUsers = newLikedUsers.filter((person) => person !== user);
    }

    // Optimistic UI Update
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setLikedUsers(newLikedUsers);
    
    // API Call Body
    const body = {
      data: {
        likes: newLikeCount,
        likedBy: newLikedUsers,
      },
    };

    try {
      const res = await fetch(`${STRAPI_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // If API fails, revert state
        setIsLiked(!newIsLiked);
        setLikeCount(!newIsLiked ? likeCount : likeCount - 2); // Revert to previous count
        setLikedUsers(likedUsers); // Revert to previous list
        console.error("Error liking post:", await res.json());
        return;
      }
    } catch (err) {
      // Revert state on network error
      setIsLiked(!newIsLiked);
      setLikeCount(!newIsLiked ? likeCount : likeCount - 2);
      setLikedUsers(likedUsers);
      console.error("Network Error liking post", err);
    }
  };

  // --- COMMENT FETCH HANDLER ---
  const showComments = useCallback(async () => {
    // Toggle collapse state first
    setIsCommentsExpanded((prev) => !prev);
    // If we're collapsing or already loading, stop here
    if (isCommentsExpanded || isLoadingComments) return;
    
    setIsLoadingComments(true);
    
    // Using populate=user to fetch the default Strapi User details
    const apiUrl = `${STRAPI_URL}/api/comments?filters[blog][id][$eq]=ri0u7lqjvsoheov2qq83rn2z&populate=user&sort=sentAt:desc&pagination[limit]=10`;

    try {
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        // Log the exact status and error message for debugging
        const errorData = await res.json();
        console.error(`Failed to fetch comments. Status: ${res.status}. Error:`, errorData);
        // Throwing the error here will catch it below and stop execution
        throw new Error(`Failed to fetch comments (Status: ${res.status})`);
      }
      
      const json = await res.json();
      
      // Map the nested Strapi data to a flatter structure for the UI
      const mappedComments = json.data
        .map(mapStrapiComment)
        .filter((c) => c !== null); 
        
      setPostComments(mappedComments);

    } catch (err) {
      console.error("Network or API Error fetching comments", err);
    } finally {
      setIsLoadingComments(false);
    }
  }, [id, token, isCommentsExpanded, isLoadingComments]);

  // --- COMMENT POST HANDLER ---
  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate comment text and User ID existence/type
    if (!commentText || !userId || (typeof userId !== 'number' && typeof userId !== 'string')) {
      console.error("Comment post failed: Comment text or valid User ID missing.", { commentText, userId });
      return;
    }
    
    setIsPostingComment(true);
    
    // IMPORTANT: Log the ID being sent to confirm the value
    console.log(`Attempting to post comment for Post ID: ${id} using User ID: ${userId}`);

    try {
      const res = await fetch(`${STRAPI_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            blog: id,         // Post ID
            user: userId,     // Sending the default Strapi User ID to the 'user' field
            content: commentText,
            sentAt: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Log the full error response from Strapi
        console.error("Failed to post comment:", data.error || data);
        return;
      }
      
      // Success: Clear input and refetch comments for the most accurate list
      setCommentText("");
      // Optimistically increment the local comment count
      setCommentCount(prev => prev + 1); 

      // Re-fetch comments to show the new one at the top
      setIsCommentsExpanded(true);
      await showComments(); 

    } catch (err) {
      console.error("Error posting comment", err);
    } finally {
      setIsPostingComment(false);
    }
  };

  // Truncate long messages
  const shouldTruncate = message.length > 200;
  const displayMessage =
    shouldTruncate && !showFullText ? message.slice(0, 200) + "..." : message;

  return (
    <article className="bg-white border p-3 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow font">
      {/* Header with author info */}
      <header className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Post Author Avatar */}
          <UserAvatar user={author} />

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 hover:text-teal-700 cursor-pointer text-sm">
              {author.name}
            </p>
            {author.title && (
              <p className="text-xs text-gray-600 leading-tight">
                {author.title}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">{postedAgo}</p>
          </div>
        </div>

        {/* Options Menu */}
        <button
          type="button"
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
          aria-label="Post options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {displayMessage}
        </div>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-gray-600 hover:text-teal-700 font-medium text-sm mt-1"
          >
            {showFullText ? "Show less" : "...see more"}
          </button>
        )}
      </div>

      {/* Images (omitting image gallery logic for brevity, assumed correct) */}
      {images && images.length > 0 && (
         <div className="mb-3">
          {images.length === 1 && (
            <div className="w-full">
              <img
                src={images[0]}
                alt="Post content"
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            </div>
          )}
          {/* Add more image rendering logic here if needed */}
        </div>
      )}

      {/* Reactions Summary */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          {likeCount > 0 && (
            <>
              <div className="flex items-center -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                  <ThumbsUp className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <span className="hover:text-teal-700 hover:underline cursor-pointer ml-1">
                {likeCount}
              </span>
              {/* Optional: Show Liked By list on hover/modal */}
              <span className="ml-2 text-gray-500">
                {likedUsers.length > 0 && (
                  `Liked by ${likedUsers.slice(0, 3).join(", ")}${likedUsers.length > 3 ? ` and ${likedUsers.length - 3} others` : ''}`
                )}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {(commentCount > 0 || postComments.length > 0) && (
            <span 
                className="hover:text-teal-700 hover:underline cursor-pointer"
                onClick={showComments}
            >
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </span>
          )}
          {(stats.shares ?? 0) > 0 && (
            <span className="hover:text-teal-700 hover:underline cursor-pointer">
              {stats.shares} {stats.shares === 1 ? "share" : "shares"}
            </span>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="border-t border-gray-200 px-2 py-1">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 ${
              isLiked ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-blue-600" : ""}`} />
            <span className="text-sm font-semibold">Like</span>
          </button>

          <button 
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600" 
            onClick={showComments}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>
          
          {/* Other action buttons */}
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
            <Send className="w-5 h-5" />
            <span className="text-sm font-semibold">Send</span>
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {isCommentsExpanded && (
        <div className="px-4 pt-3 pb-4 border-t border-gray-100">
          
          {/* Comment Form */}
          <form onSubmit={handleComment} className="flex flex-col gap-2 mb-6">
            <div className="flex items-start gap-3 border rounded-3xl p-2 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-300 transition-shadow">
              
              {/* Current User Avatar (Placeholder, or actual user context needed) */}
              <div className="mt-1">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {getInitials(user)}
                </div>
              </div>

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={userId ? "Write a comment..." : "Sign in to comment..."}
                rows={1}
                disabled={!userId || isPostingComment}
                className="flex-1 resize-none bg-transparent pt-1 pb-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none overflow-hidden"
              />
              
              <button
                type="submit"
                disabled={!userId || !commentText || isPostingComment}
                className={`flex-shrink-0 mt-1 p-1.5 rounded-full transition-colors ${
                  userId && commentText && !isPostingComment
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPostingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>

          {/* Comment List */}
          {isLoadingComments ? (
            <div className="flex justify-center py-4 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading comments...
            </div>
          ) : (
            <div className="space-y-4">
              {postComments.length > 0 ? (
                postComments.map((comment: CommentData) => (
                  <div key={comment.id} className="flex gap-3 items-start">
                    {/* Commenter Avatar */}
                    <UserAvatar user={comment.user} />

                    {/* Comment Content Bubble */}
                    <div className="flex-1 bg-gray-100 p-3 rounded-xl">
                      <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-sm text-gray-800">
                          {comment.user.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.sentAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first to reply!</p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}