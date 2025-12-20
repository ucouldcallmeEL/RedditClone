/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for the API base URL.
 * It supports both runtime (via window._env_) and build-time (via REACT_APP_API_URL) configuration.
 * 
 * Priority:
 * 1. window._env_.API_BASE_URL (runtime, set by Docker/nginx)
 * 2. process.env.REACT_APP_API_URL (build-time)
 * 3. Default fallback for local development
 */

// Get API base URL from runtime env (window._env_) or build-time env (process.env)
const getApiBaseUrl = () => {
  let baseUrl = '';
  
  // Runtime configuration (set by Docker/nginx at container startup)
  if (typeof window !== 'undefined' && window._env_ && window._env_.API_BASE_URL) {
    baseUrl = window._env_.API_BASE_URL;
  }
  // Build-time configuration (set during npm run build)
  else if (process.env.REACT_APP_API_URL) {
    baseUrl = process.env.REACT_APP_API_URL;
  }
  // Default fallback for local development
  else {
    baseUrl = 'http://localhost:4000';
  }
  
  // Normalize: remove trailing /api if present, since routes will add it
  // This allows users to set either http://localhost:4000 or http://localhost:4000/api
  return baseUrl.replace(/\/api\/?$/, '');
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API URL being used (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}

