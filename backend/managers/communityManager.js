const Community = require('../schemas/community');
const Post = require('../schemas/post');

const createCommunity = async (community) => {
    try {
        const newCommunity = new Community(community);
        await newCommunity.save();
        return newCommunity;
    } catch (error) {
        console.error("Error creating community (Manager):", error);
        throw error;
    }
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

const getModeratedCommunities = async (id) => {
    const communities = await Community.find({ moderators: id });
    return communities;
};

const deleteCommunity = async (id) => {
    const deletedCommunity = await Community.findByIdAndDelete(id);
    return deletedCommunity;
};

const getCommunityByName = async (name) => {
    const community = await Community.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    })
        .populate('moderators', 'username name')
        .populate('members', 'username name')
        .populate('owner', 'username name');
    return community;
};



async function getCommunityWithFilteredPosts(name, filter = 'hot') {
    // 1. Find the community by name and populate moderator/member display names
    const community = await Community.findOne({ name })
        .populate('moderators', 'username name')
        .populate('members', 'username name')
        .lean();

    if (!community) {
        return null;
    }

    const normalizeUser = (user) => {
        if (!user) return user;
        return { ...user, name: user.name || user.username };
    };
    community.moderators = (community.moderators || []).map(normalizeUser);
    community.members = (community.members || []).map(normalizeUser);

    // 2. Fetch all posts belonging to this community and populate author name
    let posts = await Post.find({ community: community._id })
        .populate('author', 'username name profilePicture coverPicture')
        .lean();

    if (!posts || posts.length === 0) {
        return { ...community, posts: [] };
    }

    posts = posts.map((p) => {
        const author = p.author ? { ...p.author, name: p.author.name || p.author.username } : null;
        return { ...p, author };
    });

    // 3. Sort posts based on filter logic
    posts.sort((a, b) => {
        const now = Date.now();

        switch (filter) {
            case 'hot':
                // Reddit-style hot algorithm
                const aScore = (a.upvotes - a.downvotes) + (a.comments?.length || 0);
                const bScore = (b.upvotes - b.downvotes) + (b.comments?.length || 0);

                const aAge = (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60); // hours
                const bAge = (now - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);

                const aHot = aScore / Math.pow(aAge + 2, 1.8);
                const bHot = bScore / Math.pow(bAge + 2, 1.8);

                return bHot - aHot;

            case 'new':
                return new Date(b.createdAt) - new Date(a.createdAt);

            case 'top':
                return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);

            case 'rising':
                // Velocity: comments per hour
                const aRisAge = (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
                const bRisAge = (now - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);

                const aVelocity = (a.comments?.length || 0) / (aRisAge + 1);
                const bVelocity = (b.comments?.length || 0) / (bRisAge + 1);

                return bVelocity - aVelocity;

            default:
                return 0;
        }
    });

    // 4. Return the community object with the sorted posts attached
    return { ...community, posts };
};

const getPostsByCommunityName = async (communityName) => {
    // Find the community first to get its ID
    const community = await Community.findOne({ name: communityName });
    if (!community) return [];
    const Post = require('../schemas/post');
    // Query posts by community ID (posts now have a community field instead of communities having posts array)
    const posts = await Post.find({ community: community._id }).populate('author', 'name');
    return posts;
};

// Get communities by name substring (for search)
const getCommunitiesByNameSubstring = async (substring) => {
    const communities = await Community.find({
        name: { $regex: substring, $options: 'i' }
    }).limit(10);
    return communities;
};

// Return top N communities where the user is a member, sorted by member count desc
const getTopCommunitiesForUser = async (userId, limit = 3) => {
    if (!userId) throw new Error('userId is required');

    // reuse existing helper to get communities for a user
    const communities = await getCommunitiesByUser(userId);

    // ensure populated fields (getCommunitiesByUser returns raw models so populate if needed)
    const populated = await Community.populate(communities, [
        { path: 'posts', populate: { path: 'author', select: 'username name' } },
        { path: 'moderators', select: 'username name' },
        { path: 'members', select: 'username name' },
    ]);

    const normalizeUser = (user) => (user ? { ...user.toObject?.() || user, name: user.name || user.username } : user);
    populated.forEach((c) => {
        c.moderators = (c.moderators || []).map(normalizeUser);
        c.members = (c.members || []).map(normalizeUser);
        c.posts = (c.posts || []).map((p) => ({ ...p.toObject?.() || p, author: normalizeUser(p.author) }));
    });

    // sort by member count descending and limit
    populated.sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0));
    return populated.slice(0, limit);
};


// Added functions: addMemberToCommunity, removeMemberFromCommunity
const addMemberToCommunity = async (communityIdOrName, userId) => {
    if (!userId) throw new Error('userId is required');
    const User = require('../schemas/user');

    // normalize possible `u/username` input
    const cleanedUserId = String(userId).replace(/^u\//i, '');

    // resolve user by id or name/email
    let user = null;
    if (/^[0-9a-fA-F]{24}$/.test(cleanedUserId)) {
        user = await User.findById(cleanedUserId);
    }
    if (!user) {
        user = await User.findOne({ $or: [{ username: cleanedUserId }, { name: cleanedUserId }, { email: cleanedUserId }] });
    }
    if (!user) throw new Error('User not found');

    // resolve community by name (primary) or id if an ObjectId is provided
    let community = null;
    // allow `r/` prefix on community names
    const cleanedCommunity = String(communityIdOrName).replace(/^r\//i, '');
    console.log('[addMemberToCommunity] cleanedCommunity=', cleanedCommunity);
    if (/^[0-9a-fA-F]{24}$/.test(cleanedCommunity)) {
        community = await Community.findById(cleanedCommunity);
    } else {
        // treat input as community name
        community = await getCommunityByName(cleanedCommunity);
    }
    console.log('[addMemberToCommunity] resolved community=', community?._id || community?.name || null);
    if (!community) throw new Error('Community not found');

    // Atomic, idempotent add to members and user's communities without triggering full doc validation
    const CommunityModel = require('../schemas/community');
    await CommunityModel.findByIdAndUpdate(community._id, {
        $addToSet: { members: user._id }
    });

    await User.findByIdAndUpdate(user._id, {
        $addToSet: { communities: community._id }
    });

    // return success, no need for updated community
    return;
};
const removeMemberFromCommunity = async (communityIdOrName, userId) => {
    if (!userId) throw new Error('userId is required');
    const User = require('../schemas/user');

    // normalize possible `u/username` input
    const cleanedUserId = String(userId).replace(/^u\//i, '');

    // resolve user by id or name/email
    let user = null;
    if (/^[0-9a-fA-F]{24}$/.test(cleanedUserId)) {
        user = await User.findById(cleanedUserId);
    }
    if (!user) {
        user = await User.findOne({ $or: [{ username: cleanedUserId }, { name: cleanedUserId }, { email: cleanedUserId }] });
    }
    if (!user) throw new Error('User not found');

    // resolve community by name (primary) or id if an ObjectId is provided
    let community = null;
    const cleanedCommunity = String(communityIdOrName).replace(/^r\//i, '');
    console.log('[removeMemberFromCommunity] cleanedCommunity=', cleanedCommunity);
    if (/^[0-9a-fA-F]{24}$/.test(cleanedCommunity)) {
        community = await Community.findById(cleanedCommunity);
    } else {
        community = await getCommunityByName(cleanedCommunity);
    }
    console.log('[removeMemberFromCommunity] resolved community=', community?._id || community?.name || null);
    if (!community) throw new Error('Community not found');

    // Use an atomic update to remove the user from both members and moderators arrays
    try {
        const CommunityModel = require('../schemas/community');
        const updateResult = await CommunityModel.findByIdAndUpdate(community._id, {
            $pull: { members: user._id, moderators: user._id }
        });
        console.log('[removeMemberFromCommunity] updateResult=', !!updateResult);
    } catch (e) {
        console.error('[removeMemberFromCommunity] update error', e);
        throw e;
    }

    // Remove community from user's communities array as well
    await User.findByIdAndUpdate(user._id, {
        $pull: { communities: community._id }
    });

    // return success
    return;
};

module.exports = {
    createCommunity,
    getCommunity,
    getCommunities,
    getCommunitiesByUser,
    getModeratedCommunities,
    deleteCommunity,
    getCommunityByName,
    getCommunityWithFilteredPosts,
    getPostsByCommunityName,
    getCommunitiesByNameSubstring,
    addMemberToCommunity,
    removeMemberFromCommunity
    ,
    getTopCommunitiesForUser
    ,
}