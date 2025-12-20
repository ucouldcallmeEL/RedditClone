import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRoutes, apiGet } from "../../../config/apiRoutes";
import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";
import "./OverviewTab.css";

function UpvotesTab({ userId }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendBase = useMemo(() => {
    const apiBase = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/api$/, "");
    return apiBase;
  }, []);

  const withBackendBase = (val) =>
    val && val.startsWith("/") ? `${backendBase}${val}` : val || "";

  useEffect(() => {
    if (!userId) return;
    const fetchUpvotedPosts = async () => {
      setLoading(true);
      try {
        const url = postRoutes.getUpvoted(userId).replace(/\/api\/api\//, "/api/");
        const response = await apiGet(url);
        const data = response.ok ? await response.json() : [];
        const rawPosts = Array.isArray(data) ? data : data.data || [];

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
            downvotes: post.downvotes || 0,
            comments: Array.isArray(post.comments) ? post.comments.length : 0,
            author: `u/${authorName}`,
            createdAt: post.createdAt || "",
          };
        });

        setPosts(transformedPosts);
      } catch (err) {
        console.error("Failed to fetch upvoted posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpvotedPosts();
  }, [userId, backendBase]);

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
        <EmptyState message="Looks like you haven't upvoted anything yet" />
      )}
    </div>
  );
}

export default UpvotesTab;