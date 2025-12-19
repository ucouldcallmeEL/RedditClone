import OverviewTab from "./Tabs/OverviewTab";
import PostsTab from "./Tabs/PostsTab";
import CommentsTab from "./Tabs/CommentsTab";
import UpvotesTab from "./Tabs/UpvotesTab";
import DownvotesTab from "./Tabs/DownvotesTab";

function ProfileMain({ activeTab, userId }) {
    return (
        <div className="profile-main">
            {activeTab === "Overview" && <OverviewTab userId={userId} />}
            {activeTab === "Posts" && <PostsTab userId={userId} />}
            {activeTab === "Comments" && <CommentsTab userId={userId} />}
            {activeTab === "Saved" && <div>Saved Content</div>}
            {activeTab === "History" && <div>History Content</div>}
            {activeTab === "Hidden" && <div>Hidden Content</div>}
            {activeTab === "Upvoted" && <UpvotesTab userId={userId} />}
            {activeTab === "Downvoted" && <DownvotesTab userId={userId} />}
        </div>
    );
}

export default ProfileMain;