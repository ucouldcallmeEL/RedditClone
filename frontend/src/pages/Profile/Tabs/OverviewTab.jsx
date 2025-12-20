import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { postRoutes, commentRoutes, apiGet } from "../../../config/apiRoutes";


import PostCard from "../../../components/PostCard";
import Comment from "../../../components/Comment";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

function OverviewTab({ userId }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Transform backend posts to frontend format
        const transformedPosts = rawPosts.map((post) => ({
          _id: post._id,
          id: post._id,
          title: post.title,
          body: post.content || '',
          content: post.content || '',
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0,
          comments: post.comments?.length || 0,
          author: post.author?.username || post.author?.name || 'anonymous',
          createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'recently',
          subreddit: post.community?.name ? `r/${post.community.name}` : 'r/general',
          communityIcon: post.community?.profilePicture || 'https://styles.redditmedia.com/t5_2qh4c/styles/communityIcon_ddkrl1wbp3t91.png',
          media: post.mediaUrls?.[0]?.url || null,
          isSpoiler: post.tags?.spoiler || false,
          tags: post.tags ? Object.entries(post.tags)
            .filter(([_, value]) => value === true)
            .map(([key]) => key.toUpperCase()) : [],
        }));

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