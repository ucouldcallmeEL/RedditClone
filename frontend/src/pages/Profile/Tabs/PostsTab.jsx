import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { postRoutes, apiGet } from "../../../config/apiRoutes";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

function PostsTab({ userId }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts using userId
  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await apiGet(postRoutes.getByUser(userId));
        const data = response.ok ? await response.json() : [];
        const rawPosts = Array.isArray(data) ? data : data.data || [];
        
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
      } catch (e) {
        console.error("Failed to fetch posts", e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (!userId) return null;

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
              <div key={post._id || post.id} className="overview-item">
                <PostCard
                  post={post}
                  onClick={() => navigate(`/post/${post._id || post.id}`)}
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