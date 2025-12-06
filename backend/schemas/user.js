const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,     
    },
    coverPicture: {
        type: String,  
    },
    bio: {
        type: String,    
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    karma: {
        type: Number,
        default: 0
    },
    posts: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
});

const User = mongoose.model('User', userSchema);
export default User;