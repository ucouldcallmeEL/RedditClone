import "./ProfileSidebar.css";

function ProfileSidebar() {
  return (
    <aside className="profile-sidebar">
      <div className="sidebar-card">
        <h3>StatusStatus1185</h3>
        <button className="share-btn">Share</button>

        <div className="sidebar-stats">
          <div>
            <strong>1</strong>
            <span>Karma</span>
          </div>
          <div>
            <strong>1</strong>
            <span>Contributions</span>
          </div>
        </div>

        <hr />

        <p><strong>1m</strong> Reddit Age</p>
        <p><strong>0</strong> Gold earned</p>
      </div>

      <div className="sidebar-card">
        <h4>Settings</h4>
        <ul>
          <li>Profile</li>
          <li>Curate your profile</li>
          <li>Avatar</li>
          <li>Mod Tools</li>
        </ul>
      </div>
    </aside>
  );
}

export default ProfileSidebar;
