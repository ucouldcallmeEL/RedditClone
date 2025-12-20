const mongoose = require('mongoose');
const User = require('./schemas/user');
require('dotenv').config();

const username = 'testuser'; // Replace with the username you are testing with if known, or I'll list all users

const checkUsers = async () => {
    try {
        const uri = "mongodb+srv://yehiasalman48_db_user:Y0114487332y@redditclone.tqtlvsk.mongodb.net/?appName=redditClone";
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const users = await User.find({}, 'username isModerator email');
        console.log("Users found:", users.length);
        users.forEach(u => {
            console.log(`User: ${u.username}, isModerator: ${u.isModerator}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkUsers();
