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

// NOTE: legacy `isModerator` controller removed. Moderator checks are handled
// by inspecting the community's populated `moderators` list where needed.

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
    const { userId, communityName, communityId } = req.body || {};
    const idOrName = communityId || communityName || paramName;
    if (!userId) return res.status(400).send({ error: 'userId required' });

    await addMemberToCommunity(idOrName, userId);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error('Failed to join community', err);
    const msg = err?.message || 'Failed to join community';
    const code = /not found/i.test(msg) ? 404 : 500;
    res.status(code).send({ error: msg });
  }
};

// Controller for leaving a community. Expects body: { userId, communityName }
const leaveCommunity = async (req, res) => {
  try {
    const paramName = req.params.communityName;
    const { userId, communityName, communityId } = req.body || {};
    console.log('[leaveCommunity] params:', { paramName });
    console.log('[leaveCommunity] body:', { userId, communityName, communityId });
    const idOrName = communityId || communityName || paramName;
    if (!userId) return res.status(400).send({ error: 'userId required' });

    try {
      await removeMemberFromCommunity(idOrName, userId);
      res.status(200).send({ success: true });
    } catch (innerErr) {
      console.error('[leaveCommunity] removeMemberFromCommunity error', innerErr);
      const msg = innerErr?.message || 'Failed to leave community';
      const code = /not found/i.test(msg) ? 404 : 500;
      return res.status(code).send({ error: msg });
    }
  } catch (err) {
    console.error('Failed to leave community', err);
    const msg = err?.message || 'Failed to leave community';
    const code = /not found/i.test(msg) ? 404 : 500;
    res.status(code).send({ error: msg });
  }
};

// Return Cloudinary-backed URLs for a community's profile and cover pictures
const getCommunityImages = async (req, res) => {
  try {
    // Enforce Cloudinary-only operation for this endpoint
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
      return res.status(500).send({ error: 'Cloudinary not configured. Set CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET.' });
    }

    const communityName = req.params.communityName;
    if (!communityName) return res.status(400).send({ error: 'communityName required' });

    const community = await getCommunityByName(communityName);
    if (!community) return res.status(404).send({ error: 'Community not found' });

    const cloud = require('../managers/cloudinary');

    const resolveValue = async (val) => {
      if (!val) return null;
      const s = String(val);
      // If it's already a Cloudinary URL, return as-is
      if (s.includes('res.cloudinary.com')) return s;
      // Otherwise treat it as a public id and try to resolve
      try {
        const url = await cloud.getResourceUrl(s);
        return url || s;
      } catch (e) {
        console.warn('[getCommunityImages] failed to resolve cloudinary resource', e?.message || e);
        return s;
      }
    };

    const profilePicture = await resolveValue(community.profilePicture);
    const coverPicture = await resolveValue(community.coverPicture);

    return res.send({ profilePicture, coverPicture });
  } catch (err) {
    console.error('Failed to fetch community images', err);
    return res.status(500).send({ error: 'Failed to fetch community images' });
  }
};

// Upload community image (avatar or cover). Expects multipart `image` (multer),
// and `userId` + `type` in the body (type: 'avatar'|'cover').
const uploadCommunityImage = async (req, res) => {
  try {
    const communityName = req.params.communityName;
    const { userId, type } = req.body || {};
    const file = req.file;

    if (!communityName) return res.status(400).send({ error: 'communityName required' });
    if (!userId) return res.status(400).send({ error: 'userId required' });
    if (!file) return res.status(400).send({ error: 'No file uploaded' });

    // check moderator by inspecting populated moderators on the community
    try {
      const communityForCheck = await getCommunityByName(communityName);
      if (!communityForCheck) return res.status(404).send({ error: 'Community not found' });

      const moderators = communityForCheck.moderators || [];
      const isMod = moderators.some((m) => {
        if (!m) return false;
        if (typeof m === 'string') {
          return m === userId || m === `u/${userId}` || m === `u/${String(userId).replace(/^u\//, '')}`;
        }
        const mid = String(m._id || m.id || '');
        const mname = m.username || m.name || '';
        return mid === String(userId) || mname === userId || mname === `u/${userId}`;
      });

      if (!isMod) return res.status(403).send({ error: 'User is not a moderator' });
    } catch (e) {
      console.warn('[uploadCommunityImage] failed moderator check', e?.message || e);
      return res.status(500).send({ error: 'Failed to validate moderator status' });
    }

    const cloud = require('../managers/cloudinary');

    // upload to cloudinary (use community folder)
    const folder = `reddit_clone/communities/${communityName}`;
    const uploaded = await cloud.uploadImage(file.path, folder);
    const url = typeof uploaded === 'string' ? uploaded : (uploaded?.secure_url || null);
    if (!url) return res.status(500).send({ error: 'Failed to get uploaded file URL' });

    // persist to community
    const community = await getCommunityByName(communityName);
    if (!community) return res.status(404).send({ error: 'Community not found' });

    if (String(type).toLowerCase() === 'avatar' || String(type).toLowerCase() === 'profile' || String(type).toLowerCase() === 'pfp') {
      community.profilePicture = url;
    } else {
      community.coverPicture = url;
    }

    await community.save();

    const refreshed = await getCommunityByName(communityName);
    return res.send({ success: true, community: refreshed });
  } catch (err) {
    console.error('[communityController] uploadCommunityImage error', err);
    return res.status(500).send({ error: err?.message || 'upload failed' });
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
