const { getPosts } = require('../managers/postManager');
const {
  getCommunityByName,
  createCommunity,
  getCommunitiesByNameSubstring,
  getCommunitiesByUser,
  getModeratedCommunities
} = require('../managers/communityManager');
const User = require('../schemas/user');

const getCommunityDetails = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const community = await getCommunityByName(communityName);
    if (!community) {
      return res.status(404).send({ error: 'Community not found' });
    }
    res.send(community);
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

    // Update user to be false if not already
    await User.findByIdAndUpdate(userId, { isModerator: true });

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
    res.status(500).json({ error: err.message });
  }
};

// Get communities moderated by user
const fetchModeratedCommunities = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching moderated communities for userId:", userId);
    const communities = await getModeratedCommunities(userId);
    res.json(communities || []);
  } catch (err) {
    console.error('Error fetching moderated communities:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCommunityDetails,
  checkCommunityNameExists,
  postCommunity,
  fetchCommunitiesBySubstring,
  fetchUserCommunities,
  fetchModeratedCommunities
};