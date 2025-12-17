import React from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div
      className="community-card card"
      onClick={() => navigate(`/community/${community.name}`)}
      role="button"
      tabIndex={0}
    >
      <div className="community-rank">{rank}</div>
      <div className="community-info">
        <img src={community.profilePicture} alt={`${community.name} icon`} className="community-avatar" />
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
