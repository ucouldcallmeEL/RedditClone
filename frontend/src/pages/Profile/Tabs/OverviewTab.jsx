import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { postRoutes, commentRoutes, apiGet } from "../../../config/apiRoutes";
import { API_BASE_URL } from "../../../config/apiConfig";


import PostCard from "../../../components/PostCard";
import Comment from "../../../components/Comment";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

function OverviewTab({ userId }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend base for resolving relative media/icon URLs
  const backendBase = useMemo(() => {
    return API_BASE_URL.replace(/\/api$/, "");
  }, []);

  const withBackendBase = (val) =>
    val && val.startsWith("/") ? `${backendBase}${val}` : val || "";

  const getTimeAgo = (dateString) => {
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

  // Fetch posts and comments using userId
  useEffect(() => {
    if (!userId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [postsRes, commentsRes] = await Promise.all([
          apiGet(postRoutes.getByUser(userId)),
          apiGet(commentRoutes.getByUser(userId)),
        ]);

        const postsData = postsRes.ok ? await postsRes.json() : [];
        const commentsData = commentsRes.ok ? await commentsRes.json() : [];

        const rawPosts = Array.isArray(postsData) ? postsData : postsData.data || [];
        // Transform backend posts to frontend format (JS-friendly)
        const transformedPosts = rawPosts.map((post) => {
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
        setComments(Array.isArray(commentsData) ? commentsData : commentsData.data || []);
      } catch (e) {
        console.error("Failed to fetch overview data", e);
        setPosts([]);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  const items = useMemo(() => {
    const merged = [];

    posts.forEach((p) => {
      merged.push({
        type: "post",
        data: p,
        sortValue: new Date(p.createdAt || 0).getTime(),
      });
    });

    comments.forEach((c) => {
      merged.push({
        type: "comment",
        data: c,
        sortValue: new Date(c.createdAt || 0).getTime(),
      });
    });

    merged.sort((a, b) => b.sortValue - a.sortValue);
    return merged;
  }, [posts, comments]);

  const handleOpenPost = (post) => {
    const postId = post._id || post.id;
    if (postId) navigate(`/post/${postId}`);
  };

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading..." />
      ) : items.length > 0 ? (
        <>
          <Link className="no-underline" to="/settings?tab=profile">
            <div className="overview__filter">
              <div className="filter-left">
                <Eye size={18} />
                <span>Showing all content</span>
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
            {items.map((item) => {
              const keyId = item.data._id || item.data.id;
              return (
                <div key={`${item.type}-${keyId}`} className="overview-item">
                  {item.type === "post" ? (
                    <PostCard post={item.data} onClick={() => handleOpenPost(item.data)} />
                  ) : (
                    <div className="comment-preview">
                      <Comment comment={item.data} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyState message="No posts or comments yet" />
      )}
    </div>
  );
}

export default OverviewTab;