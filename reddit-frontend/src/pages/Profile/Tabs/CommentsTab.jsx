import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Comment from "../../../components/Comment";
import SortDropdown from "../../../components/SortDropdown";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

const API_URL = import.meta.env.VITE_API_URL; // Vite

function CommentsTab() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [sortBy, setSortBy] = useState("new");
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

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/comments/user/${userId}`);
        const data = res.ok ? await res.json() : [];
        setComments(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [userId]);

  // sort comments
  const sortedComments = useMemo(() => {
    const list = [...comments];

    if (sortBy === "new") {
      list.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "old") {
      list.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortBy === "top") {
      list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    return list;
  }, [comments, sortBy]);

  if (!userId) return null;

  return (
    <div className="overview">
      {loading ? (
        <EmptyState message="Loading comments..." />
      ) : sortedComments.length > 0 ? (
        <>
          <Link className="no-underline" to="/settings?tab=profile">
            <div className="overview__filter">
              <div className="filter-left">
                <Eye size={18} />
                <span>Showing all comments</span>
              </div>
              <span className="arrow">›</span>
            </div>
          </Link>

          <div className="overview__create">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "new", label: "New" },
                { value: "old", label: "Old" },
                { value: "top", label: "Top" },
              ]}
            />
          </div>

          <div className="overview__posts">
            {sortedComments.map((comm) => (
              <div
                key={comm._id}
                className="overview-item"
              >
                <Comment comment={comm} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="Looks like you haven't commented anything yet" />
      )}
    </div>
  );
}

export default CommentsTab;
