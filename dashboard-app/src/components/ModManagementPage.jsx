import React from 'react';
import './ModManagementPage.css';
import { Star, MoreHorizontal } from 'lucide-react';

const ModManagementPage = () => {
  return (
    <div className="mod-management-container">
      
      {/* Page Header */}
      <div className="mod-page-header">
        <h1>Manage moderated communities</h1>
        <p className="mod-page-subtitle">
          You can moderate up to 5 high-traffic communities. Reach out to <a href="#">u/ModSupportBot</a> to check if you are past the limit. <a href="#">Learn more about this.</a>
        </p>
      </div>

      {/* Community List Item */}
      <div className="community-list-item">
        <div className="community-info-left">
          <div className="community-avatar-large">
            <span className="nsfw-badge-large">18</span>
          </div>
          <div className="community-text">
            <h3 className="community-title">r/ay7aga</h3>
            <span className="community-stats">1 visitor • 0 contributions last week</span>
          </div>
        </div>

        <div className="community-actions-right">
          <button className="icon-action-btn">
            <Star size={20} />
          </button>
          <button className="icon-action-btn">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ModManagementPage;