const { getPosts } = require('../managers/postManager');
const { getCommunityWithFilteredPosts, getCommunities, getCommunitiesByUser, getTopCommunitiesForUser: managerGetTopCommunitiesForUser, addMemberToCommunity, removeMemberFromCommunity,
  getCommunityByName,
  createCommunity,
  getCommunitiesByNameSubstring
} = require('../managers/communityManager');

const getCommunityDetails = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const filter = req.query.filter || 'hot'; // default to 'hot'
    const community = await getCommunityWithFilteredPosts(communityName, filter);
    if (!community) {
      return res.status(404).send({ error: 'Community not found' });
    }
    // Ensure we return plain JSON and include profile/cover pictures explicitly
    let payload = community;
    try {
      payload = community.toObject ? community.toObject() : JSON.parse(JSON.stringify(community));
    } catch (e) {
      payload = community;
    }

    payload.profilePicture = payload.profilePicture || null;
    payload.coverPicture = payload.coverPicture || null;

    return res.send(payload);
  } catch (err) {
    console.error('Failed to fetch community details', err);
    res.status(500).send({ error: 'Failed to fetch community details' });
  }
};

// Check if community name exists
const checkCommunityNameExists = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const community = await getCommunityByName(communityName);
    res.json({ exists: !!community, isNameTaken: !!community });
  } catch (err) {
    console.error('Error checking community name:', err);
    res.status(500).json({ error: 'Failed to check community name' });
  }
};

// Create a new community
const postCommunity = async (req, res) => {
  try {
    // Get authenticated user from token (set by authenticate middleware)
    const userId = req.user._id;

    // Build community data
    const communityData = {
      ...req.body,
      owner: userId,
      members: [userId],
      moderators: [userId],
    };

    const community = await createCommunity(communityData);
    res.status(201).json(community);
  } catch (err) {
    console.error('Error creating community:', err);
    res.status(400).json({ error: err.message });
  }
};

// Search communities by substring
const fetchCommunitiesBySubstring = async (req, res) => {
  try {
    const substring = req.params.substring;
    const communities = await getCommunitiesByNameSubstring(substring);
    res.json(communities);
  } catch (err) {
    console.error('Error fetching communities by substring:', err);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
};

// Get user's communities
const fetchUserCommunities = async (req, res) => {
  try {
    const userId = req.params.userId;
    const communities = await getCommunitiesByUser(userId);
    res.json(communities || []);
  } catch (err) {
    console.error('Error fetching user communities:', err);
    res.status(500).json({ error: 'Failed to fetch user communities' });
  }
};

// Check if community name exists
const checkCommunityNameExists = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const community = await getCommunityByName(communityName);
    res.json({ exists: !!community, isNameTaken: !!community });
  } catch (err) {
    console.error('Error checking community name:', err);
    res.status(500).json({ error: 'Failed to check community name' });
  }
};

// Create a new community
const postCommunity = async (req, res) => {
  try {
    // Get authenticated user from token (set by authenticate middleware)
    const userId = req.user._id;

    // Build community data
    const communityData = {
      ...req.body,
      owner: userId,
      members: [userId],
      moderators: [userId],
    };

    const community = await createCommunity(communityData);
    res.status(201).json(community);
  } catch (err) {
    console.error('Error creating community:', err);
    res.status(400).json({ error: err.message });
  }
};

// Search communities by substring
const fetchCommunitiesBySubstring = async (req, res) => {
  try {
    const substring = req.params.substring;
    const communities = await getCommunitiesByNameSubstring(substring);
    res.json(communities);
  } catch (err) {
    console.error('Error fetching communities by substring:', err);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
};

// Get user's communities
const fetchUserCommunities = async (req, res) => {
  try {
    const userId = req.params.userId;
    const communities = await getCommunitiesByUser(userId);
    res.json(communities || []);
  } catch (err) {
    console.error('Error fetching user communities:', err);
    res.status(500).json({ error: 'Failed to fetch user communities' });
  }
};

module.exports = {
  getCommunityDetails,
  checkCommunityNameExists,
  postCommunity,
  fetchCommunitiesBySubstring,
  fetchUserCommunities,
  getAllCommunities,
  getTopCommunitiesForUser,
  joinCommunity,
  leaveCommunity,
  getCommunityImages,
  uploadCommunityImage,
};
