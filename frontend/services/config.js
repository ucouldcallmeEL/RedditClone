// services/config.js
export const API_BASE_URL =
  window._env_?.API_BASE_URL || import.meta.env.VITE_APP_API_URL || "http://localhost:4000";

if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not set");
}