// src/components/Moderation/QueueMain.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/QueueMain.css';
import { HelpCircle, ChevronLeft, ChevronRight, ArrowUpDown, Check, Trash2 } from 'lucide-react';
import { fetchQueueItems, approveItem, removeItem } from '../../services/api';

const QueueMain = ({ selectedSubreddit, onSelectSubreddit, communities }) => {
    // Removed tabs state
    const [queueItems, setQueueItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadItems();
    }, [selectedSubreddit]); // Refetch when subreddit changes

    const loadItems = async () => {
        setLoading(true);
        // No status param needed anymore
        const items = await fetchQueueItems(null, selectedSubreddit);
        setQueueItems(items);
        setLoading(false);
    };

    const handleRemove = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this post?")) {
            await removeItem(id);
            loadItems(); // Refresh list
        }
    };

    return (
        <div className="queue-container">

            {/* Header Section */}
            <div className="queue-header">
                <div className="queue-title-row">
                    <div className="queue-title-left">
                        <h1>Post Moderation</h1>
                        {/* Subreddit Filter Dropdown */}
                        <select
                            className="queue-subreddit-select"
                            value={selectedSubreddit}
                            onChange={onSelectSubreddit}
                        >
                            <option value="All">All Communities</option>
                            {communities && communities.map(c => (
                                <option key={c._id} value={`r/${c.name}`}>r/{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Tabs Row Removed */}
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="queue-loading">Loading...</div>
            ) : queueItems.length === 0 ? (
                /* Empty State Content */
                <div className="queue-empty-state">
                    <img
                        src="https://www.redditstatic.com/desktop2x/img/snoomoji/cat_blep.png"
                        alt="Kitteh"
                        className="kitteh-img"
                    />
                    <h2>No posts found.</h2>
                    <p>The queue is clean.</p>
                </div>
            ) : (
                <div className="queue-list">
                    {queueItems.map((item) => (
                        <div key={item.id} className="queue-item">
                            <div className="queue-item-header">
                                <span className="queue-item-subreddit">{item.subreddit}</span>
                                <span className="queue-item-author">Posted by u/{item.author}</span>
                                <span className="queue-item-time">{new Date(item.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="queue-item-content">
                                <h3 style={{ marginTop: 0, fontSize: '16px' }}>{item.title}</h3>
                                <p>{item.body || item.content}</p>
                            </div>
                            <div className="queue-item-actions">
                                {/* Approve removed */}
                                <button className="action-btn remove" onClick={() => handleRemove(item.id)}>
                                    <Trash2 size={16} /> Delete Post
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default QueueMain;
