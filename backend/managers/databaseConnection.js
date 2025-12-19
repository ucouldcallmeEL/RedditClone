const mongoose = require('mongoose');

const uri="mongodb+srv://yehiasalman48_db_user:Y0114487332y@redditclone.tqtlvsk.mongodb.net/?appName=redditClone"

const databaseConnection = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    databaseConnection
};