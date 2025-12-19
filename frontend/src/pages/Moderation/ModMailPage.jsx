import React, { useState, useEffect } from 'react';
import '../../styles/ModMailPage.css';
import { fetchConversations, fetchMessages, sendMessage, createConversation, archiveConversation, fetchModeratedCommunities } from '../../services/api'; // Added fetchModeratedCommunities
import { PenSquare, X, Archive } from 'lucide-react';

const ModMailPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [activeFolder, setActiveFolder] = useState('inbox'); // 'inbox', 'archived', 'filtered'

    // Compose Modal State
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeRecipient, setComposeRecipient] = useState("");
    const [composeSubject, setComposeSubject] = useState("");
    const [composeBody, setComposeBody] = useState("");
    const [composeSubreddit, setComposeSubreddit] = useState(""); // Added
    const [moderatedCommunities, setModeratedCommunities] = useState([]); // Added

    // User context
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isModerator = user?.isModerator || false;

    useEffect(() => {
        loadConversations();
    }, [activeFolder]);

    useEffect(() => {
        if (selectedConversationId) {
            loadMessages(selectedConversationId);
        }
    }, [selectedConversationId]);

    // Fetch moderated communities when compose opens (or once on mount)
    useEffect(() => {
        if (isModerator) {
            fetchModeratedCommunities().then(communities => {
                setModeratedCommunities(communities);
                if (communities.length > 0) setComposeSubreddit(communities[0].name);
            });
        }
    }, [isModerator]);

    const loadConversations = async () => {
        // Pass userId for filtering privacy
        const data = await fetchConversations(activeFolder, user?._id);
        setConversations(data);
        if (data.length > 0) {
            setSelectedConversationId(data[0].id);
        } else {
            setSelectedConversationId(null);
            setMessages([]);
        }
    };

    const loadMessages = async (id) => {
        if (!id) return;
        const data = await fetchMessages(id);
        setMessages(data);
    };

    const handleSendReply = async () => {
        if (!replyContent.trim()) return;

        // If user is a mod, they reply as ModTeam (isMod=true)
        // If regular user, they reply as themselves (isMod=false)
        await sendMessage(selectedConversationId, replyContent, isModerator);
        setReplyContent("");
        loadMessages(selectedConversationId); // Refresh messages
    };

    const handleArchive = async () => {
        if (!selectedConversationId) return;
        await archiveConversation(selectedConversationId);
        loadConversations(); // Refresh list
        setMessages([]);
        setSelectedConversationId(null);
    };

    const handleComposeSubmit = async () => {
        if (!composeRecipient || !composeSubject || !composeBody) return;

        // Pass subreddit if isModerator
        const newConv = await createConversation(
            composeRecipient,
            composeSubject,
            composeBody,
            isModerator ? (composeSubreddit || "r/General") : null // Subreddit only relevant if mod sends it
        );

        // Only add to list if we are in inbox
        if (activeFolder === 'inbox') {
            setConversations([newConv, ...conversations]);
            setSelectedConversationId(newConv.id);
        }
        setIsComposeOpen(false);

        // Reset form
        setComposeRecipient("");
        setComposeSubject("");
        setComposeBody("");
        setComposeSubreddit("");
    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    // Sender Display Logic
    const getSenderName = (msg) => {
        const subreddit = selectedConversation?.subreddit || 'r/General';
        const targetUser = selectedConversation?.user || 'User';

        console.log('Debug Display:', {
            msgSender: msg.sender,
            msgIsMod: msg.isMod,
            viewerIsMod: isModerator,
            subreddit
        });

        if (msg.isMod) {
            // Mod sending message
            // "ModTeam in r/Subreddit to User"
            // This satisfies the "vice versa" likely interpretation of "Sender to Recipient" clarity
            return `ModTeam in ${subreddit} to ${targetUser}`;
        } else {
            // User sending message
            // "User to ModTeam in r/Subreddit"
            return `${msg.sender} to ModTeam in ${subreddit}`;
        }
    };

    return (
        <div className="modmail-container">
            {/* Left Sidebar: Folders & Compose */}
            <div className="modmail-sidebar">
                <div className="compose-btn-container">
                    <button className="compose-btn" onClick={() => setIsComposeOpen(true)}>
                        <PenSquare size={16} /> Compose
                    </button>
                </div>
                <div
                    className={`modmail-folder ${activeFolder === 'inbox' ? 'active' : ''}`}
                    onClick={() => setActiveFolder('inbox')}
                >
                    Inbox
                </div>
                <div
                    className={`modmail-folder ${activeFolder === 'archived' ? 'active' : ''}`}
                    onClick={() => setActiveFolder('archived')}
                >
                    Archived
                </div>
                {/* Filtered folder only relevant for Mods? */}
                <div
                    className={`modmail-folder ${activeFolder === 'filtered' ? 'active' : ''}`}
                    onClick={() => setActiveFolder('filtered')}
                >
                    Filtered
                </div>
            </div>

            {/* Middle: Conversation List */}
            <div className="modmail-list">
                {conversations.map(conv => (
                    <div
                        key={conv.id}
                        className={`conversation-item ${selectedConversationId === conv.id ? 'active' : ''}`}
                        onClick={() => setSelectedConversationId(conv.id)}
                    >
                        <div className="conv-header">
                            <span className="conv-subreddit">{conv.subreddit}</span>
                            <span className="conv-date">{new Date(conv.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="conv-subject">{conv.subject}</div>
                        <div className="conv-user">u/{conv.user}</div>
                        <div className="conv-preview">{conv.lastMessage}</div>
                    </div>
                ))}
            </div>

            {/* Right: Message Detail */}
            <div className="modmail-detail">
                {selectedConversation ? (
                    <>
                        <div className="detail-header">
                            <h2>{selectedConversation.subject}</h2>
                            {activeFolder !== 'archived' && (
                                <button className="archive-btn" title="Archive" onClick={handleArchive}>
                                    <Archive size={18} />
                                </button>
                            )}
                        </div>
                        <div className="messages-container">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message ${msg.isMod === isModerator ? 'sent' : 'received'}`}>
                                    <div className="message-header">
                                        <span className="sender">{getSenderName(msg)}</span>
                                        <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="message-body">{msg.content}</div>
                                </div>
                            ))}
                        </div>
                        <div className="reply-area">
                            <textarea
                                placeholder="Reply to conversation..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <button onClick={handleSendReply}>Reply</button>
                        </div>
                    </>
                ) : (
                    <div className="no-selection">Select a conversation to view</div>
                )}
            </div>

            {/* Compose Modal */}
            {isComposeOpen && (
                <div className="modal-overlay">
                    <div className="compose-modal">
                        <div className="modal-header">
                            <h3>New Modmail</h3>
                            <button onClick={() => setIsComposeOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {/* Subreddit Selection (Only for Mods) */}
                            {isModerator && (
                                <div className="form-group">
                                    <label>From Subreddit</label>
                                    <select
                                        value={composeSubreddit}
                                        onChange={(e) => setComposeSubreddit(e.target.value)}
                                    >
                                        <option value="">Select a community</option>
                                        {moderatedCommunities.map(community => (
                                            <option key={community._id} value={`r/${community.name}`}>
                                                r/{community.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label>To (Username)</label>
                                <input
                                    type="text"
                                    value={composeRecipient}
                                    onChange={(e) => setComposeRecipient(e.target.value)}
                                    placeholder="e.g. username"
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    value={composeBody}
                                    onChange={(e) => setComposeBody(e.target.value)}
                                    rows={5}
                                />
                            </div>
                            <button className="send-btn" onClick={handleComposeSubmit}>Send Message</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModMailPage;
