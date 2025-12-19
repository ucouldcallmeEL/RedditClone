import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

export default function SavedTab() {
  const navigate = useNavigate();

  const [savedPosts, setSavedPosts] = useState([]);
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
    setLoading(true);

    // ✅ Mock posts shaped exactly like PostCard expects
    const mockSavedPosts = [
      {
        _id: "saved1",
        communityIcon:
          "https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png",
        subreddit: "r/reactjs",
        flair: "Discussion",
        author: "u/frontend_guru",
        createdAt: "2 hours ago",
        title: "Best way to learn React in 2025",
        body: "Roadmap: fundamentals → hooks → routing → state management → projects.",
        isSpoiler: false,
        media: "",
        tags: ["react", "frontend", "roadmap"],
        upvotes: 42,
        comments: 8,
      },
      {
        _id: "saved2",
        communityIcon:
          "https://www.redditstatic.com/avatars/avatar_default_07_46A508.png",
        subreddit: "r/node",
        flair: "Question",
        author: "u/backend_dev",
        createdAt: "1 day ago",
        title: "Node.js vs Bun – real comparison",
        body: "Performance, ecosystem, DX… what would you use in production?",
        isSpoiler: false,
        media: "",
        tags: ["node", "bun", "backend"],
        upvotes: 31,
        comments: 5,
      },
    ];

    const t = setTimeout(() => {
      setSavedPosts(mockSavedPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading saved posts..." />
      ) : savedPosts.length > 0 ? (
        <>


          <div className="overview__create">
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {savedPosts.map((post) => (
              <div key={post._id} className="overview-item">
                <PostCard post={post} onClick={() => navigate(`/posts/${post._id}`)} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="No saved posts yet" />
      )}
    </div>
  );
}
