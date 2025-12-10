const mongoose = require('mongoose');

const uri = "mongodb+srv://22p0210:lab9ip@mycoursesdb.udcgumx.mongodb.net/myCoursesDB?retryWrites=true&w=majority";

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