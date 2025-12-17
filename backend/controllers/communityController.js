const { getPosts } = require("../managers/postManager");
const {
  getCommunityByName,
  createCommunity,
  getCommunitiesByNameSubstring,
  getCommunitiesByUser,
} = require("../managers/communityManager");

const getCommunityDetails = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const community = await getCommunityByName(communityName);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    res.send(community);
  } catch (err) {
    console.error("Failed to fetch community details", err);
    res.status(500).send({ error: "Failed to fetch community details" });
  }
};

const postCommunity = async (req, res) => {
  try {
    const {
      name,
      description,
      profilePicture,
      coverPicture,
      topics,
      type,
      isNSFW,
    } = req.body;

    // Get authenticated user from token (set by authenticate middleware)
    const userId = req.user._id;

    const communityData = {
      name,
      description,
      profilePicture: profilePicture || "",
      coverPicture: coverPicture || "",
      members: [userId],
      moderators: [userId],
      topics: topics || [],
      type: type || "public",
      isNSFW: isNSFW || false,
      owner: userId,
    };

    const community = await createCommunity(communityData);
    res.status(201).send(community);
  } catch (err) {
    console.error("Failed to create community", err);
    res.status(500).send({ error: "Failed to create community" });
  }
};

const fetchCommunityByName = async (req, res) => {
  const communityName = req.params.communityName;
  const community = await getCommunityByName(communityName);
  if (!community) {
    return res.status(404).send({ error: "Community not found" });
  }
  res.send(community);
  return community;
};

const checkCommunityNameExists = async (req, res) => {
  const communityName = req.params.communityName;
  const community = await getCommunityByName(communityName);
  if (!community) {
    return res.status(404).send({ error: "Community not found" });
  }
  res.send(true);
  return true;
};

const fetchCommunitiesBySubstring = async (req, res) => {
  const substring = req.params.substring;
  const communities = await getCommunitiesByNameSubstring(substring);
  if (!communities) {
    return res.status(404).send({ error: "Communities not found" });
  }
  res.send(communities);
  return communities;
};

const fetchUserCommunities = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const communities = await getCommunitiesByUser(userId);
    // Return empty array if no communities found (not an error)
    res.send(communities || []);
  } catch (err) {
    console.error("Failed to fetch user communities", err);
    res.status(500).send({ error: "Failed to fetch user communities" });
  }
};

module.exports = {
  getCommunityDetails,
  postCommunity,
  fetchCommunityByName,
  fetchCommunitiesBySubstring,
  checkCommunityNameExists,
  fetchUserCommunities,
};
