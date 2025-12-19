// Default to local backend if env is not set (prevents axios from targeting the Vite dev server)
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

if (!API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not set in .env");
}