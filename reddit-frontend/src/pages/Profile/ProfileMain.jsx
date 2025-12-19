import OverviewTab from "./Tabs/OverviewTab";
import PostsTab from "./Tabs/PostsTab";
import CommentsTab from "./Tabs/CommentsTab";
import UpvotesTab from "./Tabs/UpvotesTab";
import DownvotesTab from "./Tabs/DownvotesTab";
import SavedTab from "./Tabs/SavedTab";
import HistoryTab  from "./Tabs/HistoryTab";
import HiddenTab  from "./Tabs/HiddenTab";


function ProfileMain({ activeTab }) {
    return (
        <div className="profile-main">
            {activeTab === "Overview" && <OverviewTab/>}
            {activeTab === "Posts" && <PostsTab/>}
            {activeTab === "Comments" && <CommentsTab/>}
            {activeTab === "Saved" && <SavedTab/>}
            {activeTab === "History" && <HistoryTab/>}
            {activeTab === "Hidden" && <HiddenTab/>}
            {activeTab === "Upvoted" && <UpvotesTab/>}
            {activeTab === "Downvoted" && <DownvotesTab/>}
        </div>
    );
}

export default ProfileMain;