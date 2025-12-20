const Conversation = require('../schemas/conversation');
const User = require('../schemas/user');
const Notification = require('../schemas/Notification');

exports.getConversations = async (req, res) => {
    try {
        const { folder, userId } = req.query;
        let query = {}; // Build query based on filters

        // Filter by user if provided (Privacy and Context)
        if (userId) {
            try {
                const user = await User.findById(userId);
                if (user) {
                    // If regular user: only show conversations where they are the 'user'
                    if (!user.isModerator) {
                        query.user = user.username;
                    }
                    // If moderator: they should see all conversations for subreddits they mod
                    // For now (MVP), if they are a mod, they see all (or filtered by folder)
                    // Future: filter by user.moderatedCommunities
                }
            } catch (e) {
                console.error("Error filtering by user", e);
            }
        }

        // Folder Filtering
        if (folder === 'archived') {
            query.status = 'Archived';
        } else if (folder === 'filtered') {
            query.status = 'Filtered';
        } else {
            // Default to inbox (New or In Progress)
            // Explicitly exclude Archived and Filtered
            if (!query.status) {
                query.status = { $nin: ['Archived', 'Filtered'] };
            }
        }

        const conversations = await Conversation.find(query).sort({ timestamp: -1 });
        res.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findById(id);

        if (conversation) {
            res.json(conversation.messages);
        } else {
            res.status(404).json({ message: "Conversation not found" });
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, isMod } = req.body;

        const conversation = await Conversation.findById(id);

        if (conversation) {
            const newMessage = {
                sender: isMod ? "ModTeam" : conversation.user,
                content,
                timestamp: new Date(),
                isMod: !!isMod
            };

            conversation.messages.push(newMessage);
            conversation.lastMessage = content;
            conversation.timestamp = newMessage.timestamp;

            if (isMod) {
                conversation.status = 'In Progress';
            } else {
                conversation.status = 'New';
            }

            await conversation.save();

            // Create notification if sent by Mod
            if (isMod) {
                const user = await User.findOne({ username: conversation.user });
                if (user) {
                    await Notification.create({
                        user: user._id,
                        type: 'modmail',
                        message: `New modmail from ${conversation.subreddit}: ${content.substring(0, 50)}...`
                    });
                }
            }

            // Return the *newly created* message (mongoose subdoc has _id)
            const addedMessage = conversation.messages[conversation.messages.length - 1];
            res.json(addedMessage);
        } else {
            res.status(404).json({ message: "Conversation not found" });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

exports.createConversation = async (req, res) => {
    try {
        const { recipient, subject, body, subreddit, isMod } = req.body;

        // recipient is the 'user' in the conversation
        const conversationUser = recipient || "Anonymous";

        const newConversation = new Conversation({
            subject,
            user: conversationUser,
            subreddit: subreddit || "r/General",
            lastMessage: body,
            status: "New",
            messages: [
                {
                    sender: isMod ? "ModTeam" : conversationUser,
                    content: body,
                    isMod: !!isMod
                }
            ]
        });

        await newConversation.save();

        // Notify recipient (User) if sent by Mod
        if (isMod && recipient) {
            const user = await User.findOne({ username: recipient });
            if (user) {
                await Notification.create({
                    user: user._id,
                    type: 'modmail',
                    message: `New modmail from ${newConversation.subreddit}: ${subject}`
                });
            }
        }

        res.status(201).json(newConversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ message: "Failed to create conversation", error: error.message });
    }
};

exports.archiveConversation = async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findByIdAndUpdate(
            id,
            { status: 'Archived' },
            { new: true }
        );

        if (conversation) {
            res.json(conversation);
        } else {
            res.status(404).json({ message: "Conversation not found" });
        }
    } catch (error) {
        console.error("Error archiving conversation:", error);
        res.status(500).json({ message: "Failed to archive conversation" });
    }
};
