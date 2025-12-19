// src/components/Moderation/QueueStatsSidebar.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/QueueStatsSidebar.css';
import { X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { fetchStats } from '../../services/api';

const QueueStatsSidebar = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchStats();
            setStats(data);
        };
        loadStats();
    }, []);

    if (!stats) return <div className="stats-sidebar">Loading stats...</div>;

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
                        <p>{stats.activeMods.description}</p>
                    </div>
                    <span className="stat-number">{stats.activeMods.count}</span>
                </div>

                <div className="stat-item">
                    <div className="stat-text">
                        <h4>Published posts</h4>
                        <p>{stats.publishedPosts.description}</p>
                    </div>
                    <span className="stat-number">{stats.publishedPosts.count}</span>
                </div>

                <div className="stat-item">
                    <div className="stat-text">
                        <h4>Published comments</h4>
                        <p>{stats.publishedComments.description}</p>
                    </div>
                    <span className="stat-number">{stats.publishedComments.count}</span>
                </div>

                <div className="stat-item">
                    <div className="stat-text">
                        <h4>Reports on posts and comments</h4>
                    </div>
                    <span className="stat-number">{stats.reports.count}</span>
                </div>

                <a href="/#" className="view-more-link">
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
