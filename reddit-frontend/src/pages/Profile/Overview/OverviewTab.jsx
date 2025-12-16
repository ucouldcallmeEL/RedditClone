import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import PostCard from "../../../components/PostCard";
import { mockPosts } from "../mock";

import "./OverviewTab.css";

function OverviewTab() {
  return (
    <div className="overview">
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
        {mockPosts.slice(0, 2).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => console.log("Post clicked", post.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default OverviewTab;
