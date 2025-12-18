const { 
    getTopics, 
    getTopicsByCategory, 
    getTopicsGroupedByCategory,
    createTopic,
    findTopicByName
} = require('../managers/topicManager');

// Get all topics grouped by category
const getAllTopics = async (req, res) => {
    try {
        const groupedTopics = await getTopicsGroupedByCategory();
        res.status(200).json(groupedTopics);
    } catch (error) {
        console.error('Get all topics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get topics by specific category
const getTopicsByCategoryEndpoint = async (req, res) => {
    try {
        const { category } = req.params;
        const topics = await getTopicsByCategory(category);
        res.status(200).json(topics.map(t => t.name));
    } catch (error) {
        console.error('Get topics by category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all topics as flat list
const getTopicsList = async (req, res) => {
    try {
        const topics = await getTopics();
        res.status(200).json(topics.map(t => ({ id: t._id, name: t.name, category: t.category })));
    } catch (error) {
        console.error('Get topics list error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new topic (admin only - you can add auth middleware later)
const createTopicEndpoint = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Topic name is required' });
        }

        // Check if topic already exists
        const existingTopic = await findTopicByName(name);
        if (existingTopic) {
            return res.status(409).json({ error: 'Topic already exists' });
        }

        const newTopic = await createTopic({ name, category: category || 'Other' });
        res.status(201).json({ id: newTopic._id, name: newTopic.name, category: newTopic.category });
    } catch (error) {
        console.error('Create topic error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Topic already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllTopics,
    getTopicsByCategory: getTopicsByCategoryEndpoint,
    getTopicsList,
    createTopic: createTopicEndpoint
};

