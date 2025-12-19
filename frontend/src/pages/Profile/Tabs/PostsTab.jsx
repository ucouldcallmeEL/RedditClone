import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

const API_URL = import.meta.env.VITE_API_URL;

function PostsTab() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // get logged-in user
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = storedUser?._id || storedUser?.id;

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/posts/user/${userId}`);
        const data = res.ok ? await res.json() : [];
        setPosts(Array.isArray(data) ? data : data.data || []);
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
                  onClick={() => navigate(`/posts/${post._id || post.id}`)}
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
