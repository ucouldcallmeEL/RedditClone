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
    }).populate('moderators', 'name').populate('members', 'name').populate('owner', 'name');
    return community;
};

const getPostsByCommunityName = async (communityName) => {
    // Find the community first to get its ID
    const community = await Community.findOne({ name: communityName });
    if (!community) return [];
    
    // Query posts by community ID (posts now have a community field instead of communities having posts array)
    const Post = require('../schemas/post');
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