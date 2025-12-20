import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { commentRoutes, apiGet } from "../../../config/apiRoutes";

import Comment from "../../../components/Comment";
import SortDropdown from "../../../components/SortDropdown";
import EmptyState from "../../../components/EmptyState";

import "./OverviewTab.css";

function CommentsTab({ userId }) {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [sortBy, setSortBy] = useState("new");
  const [loading, setLoading] = useState(true);

  const resolvedUserId = useMemo(() => {
    if (userId) return userId;
    try {
      const storedUserRaw = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUserRaw) {
        const stored = JSON.parse(storedUserRaw);
        return stored?._id || stored?.id || stored?.userId || null;
      }
    } catch (e) {
      console.warn("Failed to read stored user", e);
    }
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        const [, payload] = token.split(".");
        if (payload) {
          const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
          return decoded?.userId || decoded?.sub || decoded?._id || null;
        }
      }
    } catch (e) {
      console.warn("Failed to decode token for user id", e);
    }
    return null;
  }, [userId]);

  // Fetch comments using userId
  useEffect(() => {
    if (!resolvedUserId) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await apiGet(commentRoutes.getByUser(resolvedUserId));
        const data = response.ok ? await response.json() : [];
        setComments(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [resolvedUserId]);

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

  if (!resolvedUserId) return null;

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