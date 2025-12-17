const Community = require('../schemas/community');

const createCommunity = async (community) => {
    const newCommunity = new Community(community);
    await newCommunity.save();
    return newCommunity;
};

// Fetch all communities whose name contains the given substring (case-insensitive)
const getCommunitiesByNameSubstring = async (substring) => {
    if (!substring || typeof substring !== 'string') {
        return [];
    }

    // Case-insensitive \"contains\" search on the name field
    const regex = new RegExp(substring, 'i');
    const communities = await Community.find({ name: { $regex: regex } });
    return communities;
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
    getPostsByCommunityName,
    getCommunitiesByNameSubstring
};