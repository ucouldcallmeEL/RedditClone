import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ModManagementPage.css';
import { Star, MoreHorizontal, Shield } from 'lucide-react';
import { fetchModeratedCommunities } from '../../config/apiRoutes';
import { API_BASE_URL } from '../../config/apiConfig';

const ModManagementPage = () => {
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);

    // Helper to prepend backend base URL for relative paths
    const backendBase = useMemo(() => API_BASE_URL.replace(/\/api$/, ''), []);
    const withBackendBase = (val) => (val && val.startsWith('/') ? `${backendBase}${val}` : val || '');
    const fallbackCommunityIcon = "/resources/communityIcon_9cgdstjtz58g1.png";

    // Handle image load errors
    const handleImageError = (e) => {
        const target = e.currentTarget;
        if (target.src !== `${window.location.origin}${fallbackCommunityIcon}`) {
            target.src = fallbackCommunityIcon;
        }
    };

    useEffect(() => {
        const loadCommunities = async () => {
            const data = await fetchModeratedCommunities();
            setCommunities(data);
        };
        loadCommunities();
    }, []);

    return (
        <div className="mod-management-container">

            {/* Page Header */}
            <div className="mod-page-header">
                <h1>Manage moderated communities</h1>
                <p className="mod-page-subtitle">
                    You can moderate up to 5 high-traffic communities. Reach out to <a href="/#">u/ModSupportBot</a> to check if you are past the limit. <a href="/#">Learn more about this.</a>
                </p>
            </div>

            {/* Community List */}
            {communities.length > 0 ? (
                communities.map((community) => (
                    <div
                        key={community._id}
                        className="community-list-item"
                        onClick={() => navigate(`/r/${community.name}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="community-info-left">
                            <div className="community-avatar-large">
                                <img 
                                    src={withBackendBase(community.profilePicture) || fallbackCommunityIcon} 
                                    alt={community.name} 
                                    className="community-avatar-img"
                                    onError={handleImageError}
                                />
                                {community.isNSFW && <span className="nsfw-badge-large">18</span>}
                            </div>
                            <div className="community-text">
                                <h3 className="community-title">r/{community.name}</h3>
                                <span className="community-stats">
                                    {community.members?.length || 0} members • 0 contributions last week
                                </span>
                            </div>
                        </div>

                        <div className="community-actions-right">
                            <button className="icon-action-btn" title="Favorite">
                                <Star size={20} />
                            </button>
                            <button className="icon-action-btn" title="More Options">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-communities-state">
                    <Shield size={48} className="no-mod-icon" />
                    <h3>You do not moderate any communities</h3>
                </div>
            )}

        </div>
    );
};

export default ModManagementPage;
