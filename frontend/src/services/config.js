// Get API base URL from environment variable
// For production: Set REACT_APP_API_URL when building/running the Docker container
// For development: Falls back to localhost
// The URL should include the /api path (e.g., https://backend-service.run.app/api)
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Log in development to help debug
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL) {
  console.warn("REACT_APP_API_URL is not set, using default: http://localhost:4000/api");
}