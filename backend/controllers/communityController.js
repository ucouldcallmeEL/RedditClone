const { getPosts } = require('../managers/postManager');
const { getCommunityByName } = require('../managers/communityManager');

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

module.exports = {
  getCommunityDetails,
};