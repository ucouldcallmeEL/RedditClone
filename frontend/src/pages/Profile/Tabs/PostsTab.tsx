import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { postRoutes, apiGet } from "../../../config/apiRoutes";
import type { Post } from "../../../types";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

type PostsTabProps = {
  userId?: string;
};

type BackendPost = {
  _id?: string;
  id?: string;
  title?: string;
  content?: string;
  media?: string;
  mediaUrls?: { url?: string; mediaType?: string }[];
  upvotes?: number;
  comments?: unknown[];
  author?: { username?: string; profilePicture?: string };
  community?: { name?: string; profilePicture?: string };
  createdAt?: string;
};

function PostsTab({ userId }: PostsTabProps) {
  const navigate = useNavigate();
  const resolvedUserId = useMemo(() => {
    if (userId) return userId;
    try {
      const storedUserRaw = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUserRaw) {
        const stored = JSON.parse(storedUserRaw);
        return stored?._id || stored?.id || stored?.userId || null;
      }
    } catch (e) {
      console.warn("Failed to read stored user", e);
    }
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        const [, payload] = token.split(".");
        if (payload) {
          const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
          return decoded?.userId || decoded?.sub || decoded?._id || null;
        }
      }
    } catch (e) {
      console.warn("Failed to decode token for user id", e);
    }
    return null;
  }, [userId]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Backend base for resolving relative media/icon URLs
  const backendBase = useMemo(() => {
    const apiBase = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/api$/, "");
    return apiBase;
  }, []);

  const withBackendBase = (val: string | null | undefined): string =>
    val && val.startsWith("/") ? `${backendBase}${val}` : val || "";

  const getTimeAgo = (dateString?: string): string => {
    if (!dateString) return "recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "recently";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "just now";
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    if (diffSecs < 10) return "just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
  };

  // Fetch posts using userId
  useEffect(() => {
    if (!resolvedUserId) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Guard against envs where REACT_APP_API_URL already includes /api (would create /api/api)
        const postsUrl = postRoutes.getByUser(resolvedUserId).replace(/\/api\/api\//, "/api/");
        const response = await apiGet(postsUrl);
        const data = response.ok ? await response.json() : [];
        const backendPosts: BackendPost[] = Array.isArray(data) ? data : data.data || [];
        
        // Transform backend posts to frontend format
        const transformedPosts: Post[] = backendPosts.map((post) => {
          const authorName = post.author?.username || "anonymous";
          const communityName = post.community?.name;
          const label = communityName ? `r/${communityName}` : `u/${authorName}`;
  
          const communityIcon =
            withBackendBase(post.community?.profilePicture) ||
            withBackendBase(post.author?.profilePicture) ||
            "";
  
          const mediaEntry = post.mediaUrls?.[0];
          const mediaUrl = mediaEntry?.url || post.media;
  
          return {
            id: String(post._id || post.id || ""),
            subreddit: label,
            communityIcon,
            title: post.title || "",
            body: post.content || "",
            media: mediaUrl,
            mediaUrls:
              post.mediaUrls?.map((m) => ({
                url: m?.url || "",
                mediaType: m?.mediaType,
              })) || [],
            upvotes: post.upvotes || 0,
            comments: Array.isArray(post.comments) ? post.comments.length : 0,
            shared: 0,
            author: `u/${authorName}`,
            createdAt: getTimeAgo(post.createdAt),
          };
        });
        
        setPosts(transformedPosts);
      } catch (e) {
        console.error("Failed to fetch posts", e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [resolvedUserId]);

  if (!resolvedUserId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading posts..." />
      ) : posts.length > 0 ? (
        <>
          <Link className="no-underline" to="/settings?tab=profile">
            <div className="overview__filter">
              <div className="filter-left">
                <Eye size={18} />
                <span>Showing all posts</span>
              </div>
              <span className="arrow">›</span>
            </div>
          </Link>

          <div className="overview__create">
            <button className="create-btn" onClick={() => navigate("/create")}>
              <Plus size={18} />
              Create Post
            </button>
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {posts.map((post) => (
              <div key={post.id} className="overview-item">
                <PostCard
                  post={post}
                  onClick={() => navigate(`/post/${post.id}`)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="Looks like you haven't posted anything yet" />
      )}
    </div>
  );
}

export default PostsTab;