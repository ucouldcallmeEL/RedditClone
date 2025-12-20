// src/components/QueueStatsSidebar.jsx
import React from 'react';
import './QueueStatsSidebar.css';
import { X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const QueueStatsSidebar = () => {
  return (
    <div className="stats-sidebar">
      
      {/* Top Header */}
      <div className="stats-header">
        <h3>Insights and activity</h3>
        <button className="close-btn"><X size={16} /></button>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="section-header-row">
          <span>Last 7 days</span>
          <ChevronUp size={16} />
        </div>

        <div className="subreddit-dropdown">
           <span>r/ay7aga</span>
           <ChevronDown size={14} />
        </div>

        {/* Stat Items */}
        <div className="stat-item">
          <div className="stat-text">
            <h4>Active mods</h4>
            <p>Your team made <span className="green-text">0 mod actions</span> this week</p>
          </div>
          <span className="stat-number">0</span>
        </div>

        <div className="stat-item">
          <div className="stat-text">
            <h4>Published posts</h4>
            <p>It's the same as the previous 7 days.</p>
          </div>
          <span className="stat-number">0</span>
        </div>

        <div className="stat-item">
            <div className="stat-text">
                <h4>Published comments</h4>
                <p>It's the same as the previous 7 days.</p>
            </div>
            <span className="stat-number">0</span>
        </div>

        <div className="stat-item">
             <div className="stat-text">
                <h4>Reports on posts and comments</h4>
            </div>
            <span className="stat-number">0</span>
        </div>

        <a href="#" className="view-more-link">
            View more insights <ExternalLink size={12} />
        </a>
      </div>

      <hr className="sidebar-divider" />

      {/* No Mods Active Section */}
      <div className="stats-section collapsed">
          <div className="section-header-row">
            <span>No mods are active</span>
            <ChevronUp size={16} />
          </div>
          
          <div className="mod-row">
            <div className="mod-icon">18</div>
            <div className="mod-info">
                <span className="mod-name">r/ay7aga</span>
                <span className="mod-status">No recent actions</span>
            </div>
          </div>
      </div>

    </div>
  );
};

export default QueueStatsSidebar;