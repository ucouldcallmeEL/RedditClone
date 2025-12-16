export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

if (!API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not set in .env");
}