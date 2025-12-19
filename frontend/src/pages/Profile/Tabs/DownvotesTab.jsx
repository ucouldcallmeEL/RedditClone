import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

const API_URL = import.meta.env.VITE_API_URL; // Vite

function DownvotesTab() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const fetchDownvotedPosts = async () => {
      setLoading(true);
      try {
        //adjust endpoint if your backend uses a different path
        const res = await fetch(`${API_URL}/api/posts/downvoted/${userId}`);
        const data = res.ok ? await res.json() : [];

        setPosts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to fetch downvoted posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownvotedPosts();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading downvotes..." />
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
                    navigate(`/posts/${post._id || post.id}`)
                  }
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="Looks like you haven't downvoted anything yet" />
      )}
    </div>
  );
}

export default DownvotesTab;
