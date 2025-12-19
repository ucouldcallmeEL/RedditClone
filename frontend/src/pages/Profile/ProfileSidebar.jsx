import "./ProfileSidebar.css";
import {useState , useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Edit } from "lucide-react";
import openBannerPopup from "../Settings/popups/openBannerPopup"

function ProfileSidebar() {


  const userId = "69397ceee2ea8af09ca7899c" //Until we Implement storage for Id

  const [bannerImage, setBannerImage] = useState(null);


  useEffect(() => {
        async function fetchUser(){
            const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
            setBannerImage(res.data.coverPicture || null);
        }
        fetchUser();
    }, []);

  async function handleBannerChange() {
        const result = await openBannerPopup(bannerImage);
        if (!result) return;

        const form = new FormData();
        form.append("file", result.file);

        const upload = await axios.post(`http://localhost:5000/upload/cover/${userId}`, form, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        setBannerImage(upload.data.url);
    }

  return (
    <aside className="profile-sidebar-scroll">
      <div className="profile-sidebar">
        {/* Banner */}
        <div className="sidebar-banner" style={{ backgroundImage: bannerImage ? `url('${bannerImage}')` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <button className="banner-edit-btn" onClick={handleBannerChange}>
            <Edit size={18} />
          </button>
        </div>

        {/* Main Card */}
        <div className="sidebar-card sidebar-main">
        <h3>StatusStatus1185</h3>
        <button className="share-btn">Share</button>

        {/* Followers */}
        <div className="sidebar-followers">
          <p className="followers-count">1 follower</p>
          <p className="follower-name">fkefmel</p>
        </div>

        {/* Stats Grid */}
        <div className="sidebar-stats-grid">
          <div className="stat-item">
            <strong>1</strong>
            <span>Karma</span>
          </div>
          <div className="stat-item">
            <strong>1</strong>
            <span>Contributions</span>
          </div>
          <div className="stat-item">
            <strong>1 m</strong>
            <span>Reddit Age</span>
          </div>
          <div className="stat-item">
            <strong>0</strong>
            <span>Gold earned</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="sidebar-card">
        <h4>ACHIEVEMENTS</h4>
        <div className="achievements-section">
          <div className="achievements-badges">
            🏅 🏅 🏅
          </div>
          <p>Banana Beginner, Banana Baby, Newcomer, +3 more</p>
          <p className="unlocked-text">6 unlocked <span className="view-all">View All</span></p>
        </div>
      </div>

      {/* Settings */}
      <div className="sidebar-card">
        <h4>SETTINGS</h4>
        <ul className="settings-list">
          <li>
            <div className="setting-item">
              <div>
                <p className="setting-title">Profile</p>
                <p className="setting-desc">Customize your profile</p>
              </div>
              <button className="update-btn">Update</button>
            </div>
          </li>
          <li>
            <div className="setting-item">
              <div>
                <p className="setting-title">Curate your profile</p>
                <p className="setting-desc">Manage what people see when they visit your profile</p>
              </div>
              <button className="update-btn">Update</button>
            </div>
          </li>
          <li>
            <div className="setting-item">
              <div>
                <p className="setting-title">Avatar</p>
                <p className="setting-desc">Style your avatar</p>
              </div>
              <button className="update-btn">Update</button>
            </div>
          </li>
          <li>
            <div className="setting-item">
              <div>
                <p className="setting-title">Mod Tools</p>
                <p className="setting-desc">Moderate your profile</p>
              </div>
              <button className="update-btn">Update</button>
            </div>
          </li>
        </ul>
      </div>

      {/* Social Links */}
      <div className="sidebar-card">
        <h4>SOCIAL LINKS</h4>
        <button className="add-social-btn">+ Add Social Link</button>
      </div>
      </div>
    </aside>
  );
}

export default ProfileSidebar;
