import React from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

interface CommunityProps {
  community: {
    _id: string;
    name: string;
    description: string;
    profilePicture: string;
    members: string[];
  };
  rank: number;
}

const CommunityCard: FC<CommunityProps> = ({ community, rank }) => {
  const navigate = useNavigate();
  
  // Helper to prepend backend base URL for relative paths
  const backendBase = API_BASE_URL.replace(/\/api$/, '');
  const withBackendBase = (val?: string) =>
    val && val.startsWith('/') ? `${backendBase}${val}` : val || '';
  
  const fallbackCommunityIcon = "/resources/communityIcon_9cgdstjtz58g1.png";
  const avatarSrc = withBackendBase(community.profilePicture) || fallbackCommunityIcon;
  
  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== `${window.location.origin}${fallbackCommunityIcon}`) {
      target.src = fallbackCommunityIcon;
    }
  };

  return (
    <div
      className="community-card card"
      onClick={() => navigate(`/community/${community.name}`)}
      role="button"
      tabIndex={0}
    >
      <div className="community-rank">{rank}</div>
      <div className="community-info">
        <img
          src={avatarSrc}
          alt={`${community.name} icon`}
          className="community-avatar"
          onError={handleImageError}
        />
        <div className="community-meta">
          <div className="community-title">r/{community.name}</div>
          <div className="community-desc">{community.description}</div>
          <div className="community-members">{(community.members?.length || 0).toLocaleString()} members</div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
