import { SlidersHorizontal } from "lucide-react";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";
import { mockPosts } from "../mock";

import "./OverviewTab.css";

function DownvotesTab() {
  // Get upvoted posts
  const downvotedPosts = mockPosts.filter(post => post.userDownvoted);

  return (
    <div className="overview">
      {downvotedPosts.length > 0 ? (
        <>
          <div className="overview__create">
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {downvotedPosts.map((post) => (
              <div
                key={post.id}
                className="overview-item"
              >
                <PostCard
                  post={post}
                  onClick={() => console.log("Post clicked", post.id)}
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
