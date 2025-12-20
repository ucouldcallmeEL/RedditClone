// Default to backend port 4000 (API prefix) to avoid hitting the Vite dev server by mistake
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:4000/api";
if (!API_BASE_URL) {
  console.warn("VITE_APP_API_URL is not set in .env");
}