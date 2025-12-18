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

// Return top N communities where the user is a member, sorted by member count desc
const getTopCommunitiesForUser = async (userId, limit = 3) => {
    if (!userId) throw new Error('userId is required');

    // reuse existing helper to get communities for a user
    const communities = await getCommunitiesByUser(userId);

    // ensure populated fields (getCommunitiesByUser returns raw models so populate if needed)
    const populated = await Community.populate(communities, [
        { path: 'posts', populate: { path: 'author', select: 'name' } },
        { path: 'moderators', select: 'name' },
        { path: 'members', select: 'name' },
    ]);

    // sort by member count descending and limit
    populated.sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0));
    return populated.slice(0, limit);
};


// Added functions: addMemberToCommunity, removeMemberFromCommunity
const addMemberToCommunity = async (communityIdOrName, userId) => {
    if (!userId) throw new Error('userId is required');
    const User = require('../schemas/user');

    // resolve user by id or name/email
    let user = null;
    if (/^[0-9a-fA-F]{24}$/.test(String(userId))) {
        user = await User.findById(userId);
    }
    if (!user) {
        user = await User.findOne({ $or: [{ name: userId }, { email: userId }] });
    }
    if (!user) throw new Error('User not found');

    // resolve community by name (primary) or id if an ObjectId is provided
    let community = null;
    if (/^[0-9a-fA-F]{24}$/.test(String(communityIdOrName))) {
        community = await Community.findById(communityIdOrName);
    } else {
        // treat input as community name
        community = await getCommunityByName(communityIdOrName);
    }
    if (!community) throw new Error('Community not found');

    community.members = community.members || [];
    const alreadyMember = community.members.some(m => String(m._id || m) === String(user._id));
    if (!alreadyMember) {
        community.members.push(user._id);
        await community.save();
    }

    // return fresh populated community
    return await getCommunityByName(community.name);
};
const removeMemberFromCommunity = async (communityIdOrName, userId) => {
    if (!userId) throw new Error('userId is required');
    const User = require('../schemas/user');

    // resolve user by id or name/email
    let user = null;
    if (/^[0-9a-fA-F]{24}$/.test(String(userId))) {
        user = await User.findById(userId);
    }
    if (!user) {
        user = await User.findOne({ $or: [{ name: userId }, { email: userId }] });
    }
    if (!user) throw new Error('User not found');

    // resolve community by name (primary) or id if an ObjectId is provided
    let community = null;
    if (/^[0-9a-fA-F]{24}$/.test(String(communityIdOrName))) {
        community = await Community.findById(communityIdOrName);
    } else {
        community = await getCommunityByName(communityIdOrName);
    }
    if (!community) throw new Error('Community not found');

    // Use an atomic update to remove the user from both members and moderators arrays
    const Community = require('../schemas/community');
    await Community.findByIdAndUpdate(community._id, {
        $pull: { members: user._id, moderators: user._id }
    });

    // Return fresh populated community
    return await getCommunityByName(community.name);
};

// simple ismod(userId, communityName) as requested: returns true if userId is listed in community.moderators
const ismod = async (userId, communityName) => {
    if (!userId || !communityName) return false;
    const community = await getCommunityByName(communityName);
    if (!community) return false;
    const mods = community.moderators || [];
    return mods.some(m => String(m._id || m) === String(userId));
};

// ...existing code...
module.exports = {
    createCommunity,
    getCommunity,
    getCommunities,
    getCommunitiesByUser,
    deleteCommunity,
    getCommunityByName,
    getCommunityWithFilteredPosts,
    getPostsByCommunityName,
    addMemberToCommunity,
    removeMemberFromCommunity
    ,
    getTopCommunitiesForUser
    ,
    ismod,
};