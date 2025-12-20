import React, { useState, useEffect } from 'react';
import QueueMain from '../../components/Moderation/QueueMain';
import QueueStatsSidebar from '../../components/Moderation/QueueStatsSidebar';
import '../../styles/ModQueuePage.css';
import { fetchModeratedCommunities } from '../../config/apiRoutes';

const ModQueuePage = () => {
    const [selectedSubreddit, setSelectedSubreddit] = useState('All');
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        const loadCommunities = async () => {
            try {
                // We need the user ID for this API call usually, but let's check if the API helper handles it.
                // Looking at api.js, fetchModeratedCommunities takes userId.
                // We need to get the user from localStorage.
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user._id) {
                    const data = await fetchModeratedCommunities(user._id);
                    setCommunities(data);
                }
            } catch (error) {
                console.error("Failed to load moderated communities", error);
            }
        };
        loadCommunities();
    }, []);

    const handleSubredditChange = (e) => {
        setSelectedSubreddit(e.target.value);
    };

    return (
        <div className="mod-queue-layout">
            {/* Center Content: Queue Tabs & Items */}
            <div className="queue-main-wrapper">
                <QueueMain
                    selectedSubreddit={selectedSubreddit}
                    onSelectSubreddit={handleSubredditChange}
                    communities={communities}
                />
            </div>
        </div>
    );
};

export default ModQueuePage;
