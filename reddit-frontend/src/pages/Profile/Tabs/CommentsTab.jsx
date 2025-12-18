import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import Comment from "../../../components/Comment";
import SortDropdown from "../../../components/SortDropdown";
import EmptyState from "../../../components/EmptyState";

import { mockCommentsByPost } from "../mock";

import "./OverviewTab.css";

function parseTimeAgo(str) {
  const match = str.match(/(\d+)([smhd])/);
  if (!match) return Infinity;
  const num = parseInt(match[1]);
  const unit = match[2];
  switch(unit) {
    case 's': return num / 60;
    case 'm': return num;
    case 'h': return num * 60;
    case 'd': return num * 60 * 24;
    default: return Infinity;
  }
}

function CommentsTab() {
  const [sortBy, setSortBy] = useState('new');

  // Get all comments
  const allComments = Object.values(mockCommentsByPost).flat();

  // Sort based on sortBy
  if (sortBy === 'new') {
    allComments.sort((a, b) => parseTimeAgo(a.createdAt) - parseTimeAgo(b.createdAt));
  } else if (sortBy === 'old') {
    allComments.sort((a, b) => parseTimeAgo(b.createdAt) - parseTimeAgo(a.createdAt));
  } else if (sortBy === 'top') {
    allComments.sort((a, b) => b.upvotes - a.upvotes);
  }

  return (
    <div className="overview">
      {allComments.length > 0 ? (
        <>
          <Link className="no-underline" to="/settings?tab=profile"><div className="overview__filter">
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
                { value: 'new', label: 'New' },
                { value: 'old', label: 'Old' },
                { value: 'top', label: 'Top' }
              ]}
            />
          </div>

          <div className="overview__posts">
            {allComments.map((comm) => (
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