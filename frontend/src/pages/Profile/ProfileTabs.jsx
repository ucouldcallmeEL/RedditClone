function ProfileTabs({ activeTab, setActiveTab }) {
    const tabs = [
        "Overview",
        "Posts",
        "Comments",
        "Saved",
        "History",
        "Hidden",
        "Upvoted",
        "Downvoted"
    ];

    return (
        <div className="profile-tabs">
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={activeTab === tab ? "active" : ""}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default ProfileTabs;
