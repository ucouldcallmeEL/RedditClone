import { API_BASE_URL } from "./config";

// Fetch-based API client to replace axios
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const apiClient = {
  get: async (url, config = {}) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
      ...config,
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({ error: response.statusText })),
      };
      throw error;
    }
    
    return { data: await response.json() };
  },

  post: async (url, data, config = {}) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({ error: response.statusText })),
      };
      throw error;
    }
    
    return { data: await response.json() };
  },

  put: async (url, data, config = {}) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({ error: response.statusText })),
      };
      throw error;
    }
    
    return { data: await response.json() };
  },

  delete: async (url, config = {}) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
      ...config,
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({ error: response.statusText })),
      };
      throw error;
    }
    
    return { data: await response.json().catch(() => ({})) };
  },
};

export { apiClient };