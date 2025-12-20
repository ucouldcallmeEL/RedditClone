const { getPosts, getHomePosts, getPopularPosts } = require('../managers/postManager');
const Vote = require('../schemas/vote');

const getAllPosts = async (req, res) => {
  try {
    const posts = await getPosts();

    // attach current user's vote if authenticated
    if (req.user && req.user._id) {
      const ids = posts.map(p => p._id || p.id).filter(Boolean);
      const votes = await Vote.find({ user: req.user._id, post: { $in: ids } }).lean();
      const map = {};
      votes.forEach(v => { map[String(v.post)] = v.vote; });
      posts.forEach(p => { p.userVote = map[String(p._id || p.id)] || 0; });
    }

    res.send(posts);
  } catch (err) {
    console.error('Failed to fetch all posts', err);
    res.status(500).send({ error: 'Failed to fetch posts' });
  }
};

const getHomeFeed = async (req, res) => {
  // Get userId from route params (since route is /home/:userId)
  const userId = req.params.userId || req.user?._id || req.user?.id || req.query.userId || req.body?.userId;
  if (!userId) {
    try {
      const posts = await getPosts();
      return res.send({
        posts: posts,
        warning: 'No userId provided. Showing all posts instead of personalized feed.',
        isPersonalized: false
      });
    } catch (err) {
      console.error('Failed to fetch posts', err);
      return res.status(500).send({ error: 'Failed to fetch posts' });
    }
  }
  try {
    const posts = await getHomePosts(userId);
    // attach viewer's vote if available
    if (req.user && req.user._id) {
      const ids = posts.map(p => p._id || p.id).filter(Boolean);
      const votes = await Vote.find({ user: req.user._id, post: { $in: ids } }).lean();
      const map = {};
      votes.forEach(v => { map[String(v.post)] = v.vote; });
      posts.forEach(p => { p.userVote = map[String(p._id || p.id)] || 0; });
    }

    res.send({
      posts: posts,
      isPersonalized: true
    });
  } catch (err) {
    console.error('Failed to fetch home posts', err);
    res.status(500).send({ error: 'Failed to fetch home posts' });
  }
};

const getPopularPostsHandler = async (req, res) => {
  try {
    // Support both 'filter' (from frontend) and 'time' (legacy) query params
    const timeFilter = req.query.filter || req.query.time || 'all';
    const validFilters = ['today', 'week', 'month', 'all'];
    if (!validFilters.includes(timeFilter)) {
      return res.status(400).send({
        error: 'Invalid time filter. Use: today, week, month, or all'
      });
    }
    const posts = await getPopularPosts(timeFilter);
    // attach viewer's vote if available
    if (req.user && req.user._id) {
      const ids = posts.map(p => p._id || p.id).filter(Boolean);
      const votes = await Vote.find({ user: req.user._id, post: { $in: ids } }).lean();
      const map = {};
      votes.forEach(v => { map[String(v.post)] = v.vote; });
      posts.forEach(p => { p.userVote = map[String(p._id || p.id)] || 0; });
    }

    res.send({
      posts: posts,
      timeFilter: timeFilter,
      count: posts.length
    });
  } catch (err) {
    console.error('Failed to fetch popular posts', err);
    res.status(500).send({ error: 'Failed to fetch popular posts' });
  }
};

module.exports = {
  getAllPosts,
  getHomeFeed,
  getPopularPostsHandler,
};