import OverviewTab from "./Tabs/OverviewTab";
import PostsTab from "./Tabs/PostsTab";
import CommentsTab from "./Tabs/CommentsTab";
import UpvotesTab from "./Tabs/UpvotesTab";
import DownvotesTab from "./Tabs/DownvotesTab";

function ProfileMain({ activeTab }) {
    return (
        <div className="profile-main">
            {activeTab === "Overview" && <OverviewTab/>}
            {activeTab === "Posts" && <PostsTab/>}
            {activeTab === "Comments" && <CommentsTab/>}
            {activeTab === "Saved" && <div>Saved Content</div>}
            {activeTab === "History" && <div>History Content</div>}
            {activeTab === "Hidden" && <div>Hidden Content</div>}
            {activeTab === "Upvoted" && <UpvotesTab/>}
            {activeTab === "Downvoted" && <DownvotesTab/>}
        </div>
    );
}

export default ProfileMain;