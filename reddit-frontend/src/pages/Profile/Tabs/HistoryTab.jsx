import { SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";
import "./OverviewTab.css";

const MAX_DAYS = 3;

export default function HistoryTab() {
  const navigate = useNavigate();

  const [historyPosts, setHistoryPosts] = useState([]);
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

    // ✅ MOCK interactions (like "create/upvote/downvote history")
    const interactions = [
      {
        type: "upvote",
        at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        post: {
          _id: "h1",
          communityIcon:
            "https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png",
          subreddit: "r/reactjs",
          flair: "Discussion",
          author: "u/frontend_guru",
          createdAt: "2 hours ago",
          title: "React useEffect mistakes you should avoid",
          body: "Common pitfalls: missing deps, stale closures, double renders in strict mode.",
          isSpoiler: false,
          media: "",
          tags: ["react", "hooks"],
          upvotes: 120,
          comments: 18,
        },
      },
      {
        type: "create",
        at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        post: {
          _id: "h2",
          communityIcon:
            "https://www.redditstatic.com/avatars/avatar_default_07_46A508.png",
          subreddit: "r/webdev",
          flair: "Project",
          author: "u/you",
          createdAt: "1 day ago",
          title: "I built a Reddit clone (MERN) — feedback?",
          body: "Notifications, drafts, posts, comments… what should I improve next?",
          isSpoiler: false,
          media: "",
          tags: ["mern", "project"],
          upvotes: 45,
          comments: 9,
        },
      },
      {
        type: "downvote",
        at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
        post: {
          _id: "h3",
          communityIcon:
            "https://www.redditstatic.com/avatars/avatar_default_05_FF4500.png",
          subreddit: "r/node",
          flair: "Hot take",
          author: "u/backend_dev",
          createdAt: "2 days ago",
          title: "Bun replaces Node in everything",
          body: "Not always true—ecosystem & compatibility still matter.",
          isSpoiler: false,
          media: "",
          tags: ["node", "bun"],
          upvotes: 10,
          comments: 3,
        },
      },

      // ❌ This one is older than 3 days (will be filtered out)
      {
        type: "upvote",
        at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        post: {
          _id: "old1",
          communityIcon:
            "https://www.redditstatic.com/avatars/avatar_default_01_A5A4A4.png",
          subreddit: "r/programming",
          flair: "Old",
          author: "u/old_post",
          createdAt: "5 days ago",
          title: "Old post should not appear",
          body: "This should be filtered out.",
          isSpoiler: false,
          media: "",
          tags: ["old"],
          upvotes: 999,
          comments: 99,
        },
      },
    ];

    const now = Date.now();
    const maxMs = MAX_DAYS * 24 * 60 * 60 * 1000;

    const filtered = interactions
      .filter(
        (x) =>
          x &&
          (x.type === "create" || x.type === "upvote" || x.type === "downvote")
      )
      .filter((x) => {
        const t = new Date(x.at).getTime();
        return Number.isFinite(t) && now - t <= maxMs;
      })
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    const seen = new Set();
    const uniquePosts = [];
    for (const item of filtered) {
      const post = item.post;
      const id = post?._id || post?.id;
      if (!id || seen.has(id)) continue;
      seen.add(id);

      uniquePosts.push({
        _id: id,
        communityIcon:
          post.communityIcon ||
          "https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png",
        subreddit: post.subreddit || "r/general",
        flair: post.flair || "",
        author: post.author || "u/unknown",
        createdAt: post.createdAt || new Date(item.at).toLocaleString(),
        title: post.title || "",
        body: post.body || "",
        isSpoiler: !!post.isSpoiler,
        media: post.media || "",
        tags: Array.isArray(post.tags) ? post.tags : [],
        upvotes: Number(post.upvotes ?? 0),
        comments: Number(post.comments ?? 0),
      });
    }

    const t = setTimeout(() => {
      setHistoryPosts(uniquePosts);
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading history..." />
      ) : historyPosts.length > 0 ? (
        <>
          <div className="overview__create">
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {historyPosts.map((post) => (
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
        <EmptyState message="No history in the last 3 days (create/upvote/downvote)." />
      )}
    </div>
  );
}
