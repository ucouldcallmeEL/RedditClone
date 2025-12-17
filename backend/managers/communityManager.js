const Community = require('../schemas/community');

const createCommunity = async (community) => {
    const newCommunity = new Community(community);
    await newCommunity.save();
    return newCommunity;
};

const getCommunity = async (id) => {
    const community = await Community.findById(id);
    return community;
};

const getCommunities = async () => {
    const communities = await Community.find();
    return communities;
};

const getCommunitiesByUser = async (id) => {
    const communities = await Community.find({ members: id });
    return communities;
};

const deleteCommunity = async (id) => {
    const deletedCommunity = await Community.findByIdAndDelete(id);
    return deletedCommunity;
};

const getCommunityByName = async (name) => {
    const community = await Community.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    }).populate({
        path: 'posts',
        populate: {
            path: 'author',
            select: 'name'
        }
    }).populate('moderators', 'name').populate('members', 'name');
    return community;
};

const getCommunityWithFilteredPosts = async (name, filter = 'hot') => {
    const community = await getCommunityByName(name);
    if (!community || !community.posts || community.posts.length === 0) {
        return community;
    }

    // Sort posts based on filter
    community.posts.sort((a, b) => {
        switch (filter) {
            case 'hot':
                // Reddit-style hot algorithm: considers engagement and recency
                const aScore = (a.upvotes - a.downvotes) + a.comments.length;
                const bScore = (b.upvotes - b.downvotes) + b.comments.length;
                const aDate = new Date(a.createdAt).getTime();
                const bDate = new Date(b.createdAt).getTime();
                const now = Date.now();
                
                // Decay factor based on age (newer posts get boost)
                const aAge = (now - aDate) / (1000 * 60 * 60); // hours ago
                const bAge = (now - bDate) / (1000 * 60 * 60);
                
                const aHot = aScore / Math.pow(aAge + 2, 1.8);
                const bHot = bScore / Math.pow(bAge + 2, 1.8);
                
                return bHot - aHot;
            case 'new':
                // Sort by creation date, newest first
                const aNewDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bNewDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bNewDate - aNewDate;
            case 'top':
                // Sort by net upvotes (upvotes - downvotes), highest first
                return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
            case 'rising':
                // Sort by comment velocity (most discussed posts that are relatively new)
                const aRisDate = new Date(a.createdAt).getTime();
                const bRisDate = new Date(b.createdAt).getTime();
                const nowRis = Date.now();
                
                const aRisAge = (nowRis - aRisDate) / (1000 * 60 * 60); // hours ago
                const bRisAge = (nowRis - bRisDate) / (1000 * 60 * 60);
                
                // Comments per hour (higher = rising faster)
                const aVelocity = a.comments.length / (aRisAge + 1); // +1 to avoid division by zero
                const bVelocity = b.comments.length / (bRisAge + 1);
                
                return bVelocity - aVelocity;
            default:
                return 0;
        }
    });

    return community;
};

const getPostsByCommunityName = async (communityName) => {
    const community = await Community.findOne({ name: communityName }).populate({
        path: 'posts',
        populate: {
            path: 'author',
            select: 'name'
        }
    });
    if (!community) return [];
    return community.posts;
};

module.exports = {
    createCommunity,
    getCommunity,
    getCommunities,
    getCommunitiesByUser,
    deleteCommunity,
    getCommunityByName,
    getCommunityWithFilteredPosts,
    getPostsByCommunityName
};