import axios from "axios";
import { API_BASE_URL } from "./config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Rewrite legacy frontend `/r/...` API calls to backend `/communities/...` paths
apiClient.interceptors.request.use((config) => {
  if (!config || !config.url) return config;
  // only rewrite client-side shorthand paths starting with /r/
  if (typeof config.url === 'string' && config.url.startsWith('/r/')) {
    config.url = config.url.replace(/^\/r\//, '/communities/');
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response || error?.message);
    return Promise.reject(error);
  }
);