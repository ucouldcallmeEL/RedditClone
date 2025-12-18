const Topic = require('../schemas/topic');

const createTopic = async (topic) => {
    const newTopic = new Topic(topic);
    await newTopic.save();
    return newTopic;
};

const getTopic = async (id) => {
    const topic = await Topic.findById(id);
    return topic;
};

const getTopics = async () => {
    const topics = await Topic.find().sort({ name: 1 });
    return topics;
};

const getTopicsByCategory = async (category) => {
    const topics = await Topic.find({ category: category }).sort({ name: 1 });
    return topics;
};

const getTopicsGroupedByCategory = async () => {
    const topics = await Topic.find().sort({ category: 1, name: 1 });
    
    // Group topics by category
    const grouped = {};
    topics.forEach(topic => {
        if (!grouped[topic.category]) {
            grouped[topic.category] = [];
        }
        grouped[topic.category].push(topic.name);
    });
    
    // Convert to array format for frontend
    return Object.keys(grouped).map(category => ({
        title: category,
        topics: grouped[category]
    }));
};

const updateTopic = async (id, topic) => {
    const updatedTopic = await Topic.findByIdAndUpdate(id, topic, { new: true });
    return updatedTopic;
};

const deleteTopic = async (id) => {
    const deletedTopic = await Topic.findByIdAndDelete(id);
    return deletedTopic;
};

const findTopicByName = async (name) => {
    const topic = await Topic.findOne({ name: name });
    return topic;
};

module.exports = {
    createTopic,
    getTopic,
    getTopics,
    getTopicsByCategory,
    getTopicsGroupedByCategory,
    updateTopic,
    deleteTopic,
    findTopicByName
};

