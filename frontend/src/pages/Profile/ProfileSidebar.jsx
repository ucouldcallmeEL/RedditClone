import "./ProfileSideBar.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { userRoutes, apiGet } from "../../config/apiRoutes";
import { apiPost } from "../../config/apiRoutes";

import { Edit } from "lucide-react";
import openBannerPopup from "../Settings/popups/openBannerPopup";

function ProfileSidebar({ user: initialUser }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);

    useEffect(() => {
        // If user is provided, use it; otherwise fetch current user
        if (initialUser) {
            setUser(initialUser);
            setLoading(false);
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                setLoading(true);
                const response = await apiGet(userRoutes.getCurrentUser);
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [initialUser]);

    async function handleBannerChange() {
        if (!user?._id && !user?.id) return;
        const userId = user._id || user.id;

        const result = await openBannerPopup(user?.coverPicture || null);
        if (!result) return;

        const form = new FormData();
        form.append("file", result.file);

        try {
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/upload/cover/${userId}`, {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: form,
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => ({ ...prev, coverPicture: data.url }));
            }
        } catch (err) {
            console.error("Failed to upload cover:", err);
        }
    }

    if (loading) {
        return (
            <aside className="profile-sidebar-scroll">
                <div className="profile-sidebar">Loading...</div>
            </aside>
        );
    }

    if (!user) {
        return null;
    }

    const followersCount = user.followers?.length || 0;
    const contributions = user.posts?.length || 0;
    const redditAge = user.createdAt 
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const redditAgeDisplay = redditAge < 30 
        ? `${redditAge} d` 
        : redditAge < 365 
        ? `${Math.floor(redditAge / 30)} m` 
        : `${Math.floor(redditAge / 365)} y`;

    return (
        <aside className="profile-sidebar-scroll">
            <div className="profile-sidebar">
                {/* Banner */}
                <div 
                    className="sidebar-banner" 
                    style={{ 
                        backgroundImage: user.coverPicture ? `url('${user.coverPicture}')` : undefined, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' 
                    }}
                >
                    <button className="banner-edit-btn" onClick={handleBannerChange}>
                        <Edit size={18} />
                    </button>
                </div>

                {/* Main Card */}
                <div className="sidebar-card sidebar-main">
                    <h3>{user.username || user.name}</h3>
                    <button className="share-btn">Share</button>

                    {/* Followers */}
                    <div className="sidebar-followers">
                        <p className="followers-count">{followersCount} {followersCount === 1 ? 'follower' : 'followers'}</p>
                        {user.followers && user.followers.length > 0 && (
                            <p className="follower-name">
                                {typeof user.followers[0] === 'object' 
                                    ? user.followers[0].username || user.followers[0].name 
                                    : 'User'}
                            </p>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="sidebar-stats-grid">
                        <div className="stat-item">
                            <strong>{user.karma || 0}</strong>
                            <span>Karma</span>
                        </div>
                        <div className="stat-item">
                            <strong>{contributions}</strong>
                            <span>Contributions</span>
                        </div>
                        <div className="stat-item">
                            <strong>{redditAgeDisplay}</strong>
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