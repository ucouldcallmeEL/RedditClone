/**
 * Centralized API Routes Configuration
 * 
 * This file contains all API endpoint URLs used throughout the frontend.
 * Update backend routes here to keep frontend and backend in sync.
 */

import { API_BASE_URL } from './apiConfig';
/**
 * Community API Routes
 */
export const communityRoutes = {
  // Check if community name exists
  checkName: (name) => `${API_BASE_URL}/r/check/${encodeURIComponent(name)}`,

  // Create a new community
  create: `${API_BASE_URL}/r/create`,

  // Get community details by name
  getByName: (name) => `${API_BASE_URL}/r/${encodeURIComponent(name)}`,

  // Search communities by substring
  search: (substring) => `${API_BASE_URL}/r/search/${encodeURIComponent(substring)}`,

  // Get user's communities
  getUserCommunities: (userId) => `${API_BASE_URL}/r/user/${userId}`,
};

/**
 * Post API Routes
 */
export const postRoutes = {
  // Create a new post
  create: `${API_BASE_URL}/api/posts/create`,

  // Get post details by ID
  getById: (id) => `${API_BASE_URL}/api/posts/${id}`,

  // Get all posts
  getAll: `${API_BASE_URL}/api/posts`,

  // Get posts by user
  getByUser: (userId) => `${API_BASE_URL}/api/posts/user/${userId}`,

  // Get home feed posts
  getHomeFeed: (userId) => `${API_BASE_URL}/api/posts/home/${userId}`,

  // Get popular posts
  getPopular: (timeFilter = 'all') => `${API_BASE_URL}/api/posts/popular?filter=${timeFilter}`,

  // Get upvoted posts by user
  getUpvoted: (userId) => `${API_BASE_URL}/api/posts/upvoted/${userId}`,

  // Get downvoted posts by user
  getDownvoted: (userId) => `${API_BASE_URL}/api/posts/downvoted/${userId}`,
};

/**
 * User API Routes
 */
export const userRoutes = {
  // User authentication/login
  login: `${API_BASE_URL}/api/users/login`,

  // User registration/signup
  signup: `${API_BASE_URL}/api/users/signup`,
  phoneSignin: `${API_BASE_URL}/api/users/phone/signin`,
  phoneSignup: `${API_BASE_URL}/api/users/phone/signup`,
  checkEmail: `${API_BASE_URL}/api/users/signup/check-email`,
  generateUsername: `${API_BASE_URL}/api/users/generate-username`,

  // Get user profile
  getProfile: (userId) => `${API_BASE_URL}/api/users/${userId}`,

  // Update user profile
  updateProfile: (userId) => `${API_BASE_URL}/users/${userId}`,
};

/**
 * Topic API Routes
 */
export const topicRoutes = {
  // Get all topics grouped by category
  getAll: `${API_BASE_URL}/topics`,

  // Get all topics as flat list
  getList: `${API_BASE_URL}/topics/list`,

  // Get topics by category
  getByCategory: (category) => `${API_BASE_URL}/topics/category/${encodeURIComponent(category)}`,

  // Create a new topic (admin)
  create: `${API_BASE_URL}/topics`,
};

/**
 * Get user's subscribed communities (uses authenticated user)
 */
// export const getUserCommunities = () => `${API_BASE_URL}/communities/user/me`;

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Helper function to make authenticated API calls
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export const apiCall = async (url, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Add Bearer token if available
      ...options.headers,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  return fetch(url, mergedOptions);
};

/**
 * Helper function for GET requests
 */
export const apiGet = (url, options = {}) => {
  return apiCall(url, { ...options, method: 'GET' });
};

/**
 * Helper function for POST requests
 */
export const apiPost = (url, data, options = {}) => {
  return apiCall(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Helper function for PUT requests
 */
export const apiPut = (url, data, options = {}) => {
  return apiCall(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Helper function for DELETE requests
 */
export const apiDelete = (url, options = {}) => {
  return apiCall(url, { ...options, method: 'DELETE' });
};




/**
 * Upload API Routes (multipart/form-data)
 */
export const uploadRoutes = {
  postMedia: (postId) => `${API_BASE_URL}/api/upload/post/${postId}`,
  userAvatar: (userId) => `${API_BASE_URL}/api/upload/profile/${userId}`,
  userCover: (userId) => `${API_BASE_URL}/api/upload/cover/${userId}`,
  communityIcon: (communityId) => `${API_BASE_URL}/api/upload/community/${communityId}/icon`,
  communityBanner: (communityId) => `${API_BASE_URL}/api/upload/community/${communityId}/banner`,
};
/**
 * Comment API Routes
 */
export const commentRoutes = {
  getByUser: (userId) => `${API_BASE_URL}/api/comments/user/${userId}`,
};

/**
 * Service Functions
 * migrated from services/api.js
 */

export const fetchQueueItems = async (status, subreddit) => {
  try {
    const params = new URLSearchParams({ status });
    if (subreddit) params.append('subreddit', subreddit);

    const response = await apiGet(`${API_BASE_URL}/api/queue?${params.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching queue items:", error);
    return [];
  }
};

export const approveItem = async (id) => {
  try {
    const response = await apiPost(`${API_BASE_URL}/api/queue/${id}/approve`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error approving item:", error);
    throw error;
  }
};

export const removeItem = async (id) => {
  try {
    const response = await apiPost(`${API_BASE_URL}/api/queue/${id}/remove`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const response = await apiGet(`${API_BASE_URL}/api/stats`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};

export const fetchModeratedCommunities = async () => {
  try {
    const response = await apiGet(`${API_BASE_URL}/api/communities/user/moderated`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching moderated communities:", error);
    return [];
  }
};

export const fetchCommunities = async () => {
  try {
    const response = await apiGet(`${API_BASE_URL}/api/communities`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
};

export const searchCommunities = async (query) => {
  try {
    const response = await apiGet(`${API_BASE_URL}/api/communities/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error searching communities:", error);
    return [];
  }
};

export const fetchConversations = async (folder = 'inbox', userId = '') => {
  try {
    const params = new URLSearchParams();
    if (folder) params.append('folder', folder);
    if (userId) params.append('userId', userId);

    const response = await apiGet(`${API_BASE_URL}/api/modmail/conversations?${params.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const response = await apiGet(`${API_BASE_URL}/api/modmail/conversations/${conversationId}/messages`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const sendMessage = async (conversationId, content, isMod = true) => {
  try {
    const response = await apiPost(`${API_BASE_URL}/api/modmail/conversations/${conversationId}/messages`, { content, isMod });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const updateUser = async (userId, settings) => {
  try {
    const response = await apiPut(`${API_BASE_URL}/api/users/update-settings`, {
      userId,
      settings
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

export const createConversation = async (recipient, subject, body, subreddit, isMod = false) => {
  try {
    const response = await apiPost(`${API_BASE_URL}/api/modmail/conversations`, { recipient, subject, body, subreddit, isMod });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const archiveConversation = async (conversationId) => {
  try {
    const response = await apiPost(`${API_BASE_URL}/api/modmail/conversations/${conversationId}/archive`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error archiving conversation:", error);
    throw error;
  }
};
