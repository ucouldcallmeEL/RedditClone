import { apiClient } from "./apiClient";

// Backend mounts notifications router at /api/notifications (see backend/app.js)
// apiClient already has baseURL set, so we just need the path
const BASE = "/notifications";

export const getNotifications = (userId) => {
  return apiClient.get(`${BASE}/${userId}`);
};

export const getUnreadNotifications = (userId) => {
  return apiClient.get(`${BASE}/unread/${userId}`);
};

export const markAllRead = (userId) => {
  return apiClient.put(`${BASE}/mark-read/${userId}`);
};

export const markOneRead = (notifId) => {
  return apiClient.put(`${BASE}/mark-one/${notifId}`);
};

export const deleteNotification = (notifId) => {
  return apiClient.delete(`${BASE}/${notifId}`);
};

// Clear all
export const clearAllNotifications = (userId) => {
  return apiClient.delete(`${BASE}/clear/${userId}`);
};


// export const testCreateNotification = (body) => {
//   return apiClient.post(`${BASE}/test-create`, body);
// };
