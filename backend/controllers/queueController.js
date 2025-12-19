const Post = require('../schemas/post');
const { getModeratedCommunities } = require('../managers/communityManager');

exports.getQueueItems = async (req, res) => {
    try {
        const { subreddit } = req.query;
        const userId = req.user._id;

        // Fetch communities moderated by the user
        const moderatedCommunities = await getModeratedCommunities(userId);

        // If user moderates nothing, return empty
        if (!moderatedCommunities || moderatedCommunities.length === 0) {
            return res.json([]);
        }

        const moderatedIds = moderatedCommunities.map(c => c._id);
        const moderatedNames = moderatedCommunities.map(c => c.name);

        let query = {
            community: { $in: moderatedIds }
        };

        // If specific subreddit filter is requested
        if (subreddit && subreddit !== 'All') {
            // subreddit param comes as "r/name", strict check might need stripping "r/"
            // But let's check how frontend sends it. It sends "r/Name".
            // We need to find the ID for this specific community name.
            // Or easier: Filter the ID list by the name.
            const targetName = subreddit.replace('r/', '');
            const targetCommunity = moderatedCommunities.find(c => c.name === targetName);

            if (targetCommunity) {
                query.community = targetCommunity._id;
            } else {
                // If they asked for a sub they don't moderate (or doesn't exist), return empty
                return res.json([]);
            }
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'username') // Adjust if user schema uses 'name' or 'username'
            .populate('community', 'name');

        // Transform for frontend if needed, or send as is.
        // Frontend expects: id, subreddit, author, content/title, timestamp
        const formattedPosts = posts.map(p => ({
            id: p._id,
            subreddit: `r/${p.community ? p.community.name : 'Unknown'}`,
            author: p.author ? p.author.username : 'Unknown',
            content: p.title + (p.content ? ` - ${p.content}` : ''), // Show title/content
            timestamp: p.createdAt,
            // post specific fields
            title: p.title,
            body: p.content
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error("Error fetching queue items:", error);
        res.status(500).json({ message: "Failed to fetch queue items" });
    }
};

exports.approveItem = async (req, res) => {
    // Deprecated for "Post Moderation" view but keeping endpoint to avoid 404s if called
    res.json({ message: "No action needed" });
};

exports.removeItem = async (req, res) => {
    try {
        const { id } = req.params;
        // Permanently delete the post
        const deletedPost = await Post.findByIdAndDelete(id);

        if (deletedPost) {
            res.json({ message: "Post deleted successfully", id });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Failed to delete post" });
    }
};
