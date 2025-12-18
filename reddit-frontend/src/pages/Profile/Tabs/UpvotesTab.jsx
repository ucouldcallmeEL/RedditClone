import { SlidersHorizontal } from "lucide-react";

import PostCard from "../../../components/PostCard";
import EmptyState from "../../../components/EmptyState";
import { mockPosts } from "../mock";

import "./OverviewTab.css";

function UpvotesTab() {
  // Get upvoted posts
  const upvotedPosts = mockPosts.filter(post => post.userUpvoted);

  return (
    <div className="overview">
      {upvotedPosts.length > 0 ? (
        <>
          <div className="overview__create">
            <button className="icon-btn">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="overview__posts">
            {upvotedPosts.map((post) => (
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
        <EmptyState message="Looks like you haven't upvoted anything yet" />
      )}
    </div>
  );
}

export default UpvotesTab;
