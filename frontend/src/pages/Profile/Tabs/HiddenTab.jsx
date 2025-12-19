import { EyeOff, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

export default function HiddenTab() {
  const navigate = useNavigate();

  const [hiddenPosts, setHiddenPosts] = useState([]);
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

    // ✅ Mock hidden posts shaped exactly like PostCard expects
    const mockHiddenPosts = [
      {
        _id: "hidden1",
        communityIcon:
          "https://www.redditstatic.com/avatars/avatar_default_05_FF4500.png",
        subreddit: "r/javascript",
        flair: "Tip",
        author: "u/js_ninja",
        createdAt: "3 hours ago",
        title: "One JS trick that saves me every day",
        body: "Use optional chaining + nullish coalescing to avoid crashes.",
        isSpoiler: false,
        media: "",
        tags: ["javascript", "tips"],
        upvotes: 120,
        comments: 22,
      },
      {
        _id: "hidden2",
        communityIcon:
          "https://www.redditstatic.com/avatars/avatar_default_01_A5A4A4.png",
        subreddit: "r/webdev",
        flair: "Discussion",
        author: "u/ui_builder",
        createdAt: "2 days ago",
        title: "CSS modules vs Tailwind — what do you prefer?",
        body: "Trying to pick a styling approach for a medium-sized app.",
        isSpoiler: false,
        media: "",
        tags: ["css", "tailwind", "webdev"],
        upvotes: 76,
        comments: 14,
      },
    ];

    const t = setTimeout(() => {
      setHiddenPosts(mockHiddenPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading hidden posts..." />
      ) : hiddenPosts.length > 0 ? (
        <>
          <div className="overview__create">
            <button className="icon-btn" title="Filter (mock)">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {hiddenPosts.map((post) => (
              <div key={post._id} className="overview-item">
                <PostCard
                  post={post}
                  onClick={() => navigate(`/posts/${post._id}`)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="No hidden posts yet" />
      )}
    </div>
  );
}
