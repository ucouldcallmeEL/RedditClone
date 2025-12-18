/**
 * Centralized API Routes Configuration
 * 
 * This file contains all API endpoint URLs used throughout the frontend.
 * Update backend routes here to keep frontend and backend in sync.
 */

// API base URL - defaults to localhost:4000/api if REACT_APP_API_URL is not set
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
  getById: (id) => `${API_BASE_URL}/posts/${id}`,
  
  // Get all posts
  getAll: `${API_BASE_URL}/posts`,
  
  // Get posts by user
  getByUser: (userId) => `${API_BASE_URL}/posts/user/${userId}`,
  
  // Get home feed posts
  getHomeFeed: (userId) => `${API_BASE_URL}/posts/home/${userId}`,
  
  // Get popular posts
  getPopular: (timeFilter = 'all') => `${API_BASE_URL}/posts/popular?filter=${timeFilter}`,
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

