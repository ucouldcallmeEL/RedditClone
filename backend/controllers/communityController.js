const { getPosts } = require('../managers/postManager');
const { getCommunityWithFilteredPosts, getCommunities, getCommunitiesByUser, getTopCommunitiesForUser: managerGetTopCommunitiesForUser, addMemberToCommunity, removeMemberFromCommunity } = require('../managers/communityManager');

const getCommunityDetails = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const filter = req.query.filter || 'hot'; // default to 'hot'
    const community = await getCommunityWithFilteredPosts(communityName, filter);
    if (!community) {
      return res.status(404).send({ error: 'Community not found' });
    }
    res.send(community);
  } catch (err) {
    console.error('Failed to fetch community details', err);
    res.status(500).send({ error: 'Failed to fetch community details' });
  }
};

const getAllCommunities = async (req, res) => {
  try {
    const communities = await getCommunities();
    res.send(communities);
  } catch (err) {
    console.error('Failed to fetch communities', err);
    res.status(500).send({ error: 'Failed to fetch communities' });
  }
};

// Return top N communities the specified user is a member of (sorted by member count desc)
const getTopCommunitiesForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).send({ error: 'userId required' });

    // Use manager helper to get top communities directly
    const top = await managerGetTopCommunitiesForUser(userId, 3);
    res.send(top);
  } catch (err) {
    console.error('Failed to fetch top communities for user', err);
    res.status(500).send({ error: 'Failed to fetch top communities for user' });
  }
};

// Controller for joining a community. Expects body: { userId, communityName }
const joinCommunity = async (req, res) => {
  try {
    const paramName = req.params.communityName;
    const { userId, communityName } = req.body || {};
    const nameToUse = communityName || paramName;
    const updated = await addMemberToCommunity(nameToUse, userId);
    res.status(200).send({ success: true, community: updated });
  } catch (err) {
    console.error('Failed to join community', err);
    res.status(500).send({ error: 'Failed to join community' });
  }
};

// Controller for leaving a community. Expects body: { userId, communityName }
const leaveCommunity = async (req, res) => {
  try {
    const paramName = req.params.communityName;
    const { userId, communityName } = req.body || {};
    const nameToUse = communityName || paramName;
    const updated = await removeMemberFromCommunity(nameToUse, userId);
    res.status(200).send({ success: true, community: updated });
  } catch (err) {
    console.error('Failed to leave community', err);
    res.status(500).send({ error: 'Failed to leave community' });
  }
};

module.exports = {
  getCommunityDetails,
  getAllCommunities,
  getTopCommunitiesForUser,
  joinCommunity,
  leaveCommunity,
};