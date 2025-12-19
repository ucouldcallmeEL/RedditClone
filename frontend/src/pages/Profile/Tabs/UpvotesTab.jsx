import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRoutes, apiGet } from "../../../config/apiRoutes";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

function UpvotesTab({ userId }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch upvoted posts using userId
  useEffect(() => {
    if (!userId) return;

    const fetchUpvotedPosts = async () => {
      setLoading(true);
      try {
        const response = await apiGet(postRoutes.getUpvoted(userId));
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
      } catch (err) {
        console.error("Failed to fetch upvoted posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpvotedPosts();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading upvotes..." />
      ) : posts.length > 0 ? (
        <>
          <div className="overview__create">
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {posts.map((post) => (
              <div
                key={post._id || post.id}
                className="overview-item"
              >
                <PostCard
                  post={post}
                  onClick={() =>
                    navigate(`/post/${post._id || post.id}`)
                  }
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="Looks like you haven't upvoted anything yet" />
      )}
    </div>
  );
}

export default UpvotesTab;