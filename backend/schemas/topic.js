const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Popular', 'Places & Travel', 'Entertainment', 'Gaming', 'Other'],
        default: 'Other'
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;

