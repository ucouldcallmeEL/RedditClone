function ProfileTabs({ activeTab, setActiveTab }) {
    const tabs = [
        "Overview",
        "Posts",
        "Comments",
        "Upvoted",
        "Downvoted",
        "Saved",
        "History",
        "Hidden"  
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