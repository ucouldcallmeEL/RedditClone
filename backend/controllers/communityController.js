const { getPosts } = require('../managers/postManager');
const { getCommunityWithFilteredPosts, getCommunities } = require('../managers/communityManager');

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

module.exports = {
  getCommunityDetails,
  getAllCommunities,
};