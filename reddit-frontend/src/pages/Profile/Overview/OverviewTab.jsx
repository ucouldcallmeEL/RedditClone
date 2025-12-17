import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import PostCard from "../../../components/PostCard";
import Comment from "../../../components/Comment";
import EmptyState from "../../../components/EmptyState";
import { mockPosts , mockCommentsByPost } from "../mock";

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

function OverviewTab() {
  // Combine posts and comments
  const items = [];

  mockPosts.forEach(post => {
    items.push({ type: 'post', data: post, sortValue: parseTimeAgo(post.createdAt) });
  });

  Object.values(mockCommentsByPost).forEach(comments => {
    comments.forEach(comment => {
      items.push({ type: 'comment', data: comment, sortValue: parseTimeAgo(comment.createdAt) });
    });
  });

  // Sort by sortValue ascending (newest first)
  items.sort((a, b) => a.sortValue - b.sortValue);

  return (
    <div className="overview">
      {items.length > 0 ? (
        <>
          <Link className="no-underline" to="/settings?tab=profile"><div className="overview__filter">
            <div className="filter-left">
              <Eye size={18} />
              <span>Showing all content</span>
            </div>
            <span className="arrow">›</span>
          </div>
          </Link>

          <div className="overview__create">
            <button className="create-btn">
              <Plus size={18} />
              Create Post
            </button>
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {items.map((item, index) => (
              item.type === 'post' ? (
                <PostCard
                  key={`post-${item.data.id}`}
                  post={item.data}
                  onClick={() => console.log("Post clicked", item.data.id)}
                />
              ) : (
                <div key={`comment-${item.data._id}`} className="comment-preview">
                  <Comment comment={item.data} />
                </div>
              )
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="No posts or comments yet" />
      )}
    </div>
  );
}

export default OverviewTab;
