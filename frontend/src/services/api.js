import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Add a request interceptor to include the auth token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const fetchQueueItems = async (status, subreddit) => {
    try {
        const params = { status };
        if (subreddit) params.subreddit = subreddit;

        const response = await axios.get(`${API_URL}/queue`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching queue items:", error);
        return [];
    }
};

export const approveItem = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/queue/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error("Error approving item:", error);
        throw error;
    }
};

export const removeItem = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/queue/${id}/remove`);
        return response.data;
    } catch (error) {
        console.error("Error removing item:", error);
        throw error;
    }
};

export const fetchStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return null;
    }
};

export const fetchModeratedCommunities = async () => {
    try {
        const response = await axios.get(`${API_URL}/communities/user/moderated`);
        return response.data;
    } catch (error) {
        console.error("Error fetching moderated communities:", error);
        return [];
    }
};

export const fetchCommunities = async () => {
    try {
        const response = await axios.get(`${API_URL}/communities`);
        return response.data;
    } catch (error) {
        console.error("Error fetching communities:", error);
        return [];
    }
};

export const fetchConversations = async (folder = 'inbox', userId = '') => {
    try {
        const response = await axios.get(`${API_URL}/modmail/conversations`, {
            params: { folder, userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};

export const fetchMessages = async (conversationId) => {
    try {
        const response = await axios.get(`${API_URL}/modmail/conversations/${conversationId}/messages`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

export const sendMessage = async (conversationId, content, isMod = true) => {
    try {
        const response = await axios.post(`${API_URL}/modmail/conversations/${conversationId}/messages`, { content, isMod });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const updateUser = async (userId, settings) => {
    try {
        const response = await axios.put(`${API_URL}/users/update-settings`, {
            userId,
            settings
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user settings:", error);
        throw error;
    }
};

export const createConversation = async (recipient, subject, body, subreddit) => {
    try {
        const response = await axios.post(`${API_URL}/modmail/conversations`, { recipient, subject, body, subreddit });
        return response.data;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
    }
};

export const archiveConversation = async (conversationId) => {
    try {
        const response = await axios.post(`${API_URL}/modmail/conversations/${conversationId}/archive`);
        return response.data;
    } catch (error) {
        console.error("Error archiving conversation:", error);
        throw error;
    }
};
