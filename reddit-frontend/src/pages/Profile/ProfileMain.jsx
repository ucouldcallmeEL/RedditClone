import OverviewTab from "./Overview/OverviewTab";

function ProfileMain({ activeTab }) {
    return (
        <div className="profile-main">
            {activeTab === "Overview" && <OverviewTab/>}
            {activeTab === "Posts" && <div>Posts Content</div>}
            {activeTab === "Comments" && <div>Comments Content</div>}
            {activeTab === "Saved" && <div>Saved Content</div>}
            {activeTab === "History" && <div>History Content</div>}
            {activeTab === "Hidden" && <div>Hidden Content</div>}
            {activeTab === "Upvoted" && <div>Upvoted Content</div>}
            {activeTab === "Downvoted" && <div>Downvoted Content</div>}
        </div>
    );
}

export default ProfileMain;