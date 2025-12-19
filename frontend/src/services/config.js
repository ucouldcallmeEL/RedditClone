// Default to local backend if env is not set
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

if (!API_BASE_URL) {
  console.warn("REACT_APP_API_URL is not set in .env");
}