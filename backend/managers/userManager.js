const User = require('../schemas/user');

const createUser = async (user) => {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
};

const getUser = async (id) => {
    const user = await User.findById(id);
    return user;
};

const getUsers = async () => {
    const users = await User.find();
    return users;
};

const updateUser = async (id, user) => {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
};

const deleteUser = async (id) => {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
};

const getusersByCommunity = async (id) => {
    const users = await User.find({ communities: id });
    return users;
};

// Authentication functions
const findByEmail = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
};

const findByUsername = async (username) => {
    const user = await User.findOne({ username: username });
    return user;
};

const findByEmailOrUsername = async (identifier) => {
    // Try to find by email first, then by username
    const user = await User.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier }
        ]
    });
    return user;
};

const findByPhone = async (phone) => {
    const user = await User.findOne({ phone: phone });
    return user;
};

// const checkEmailExists = async (email) => {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     return !!user;
// };

// const checkUsernameExists = async (username) => {
//     const user = await User.findOne({ username: username });
//     return !!user;
// };

// const checkPhoneExists = async (phone) => {
//     const user = await User.findOne({ phone: phone });
//     return !!user;
// };

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    getusersByCommunity,
    findByEmail,
    findByUsername,
    findByEmailOrUsername,
    findByPhone,
    // checkEmailExists,
    // checkUsernameExists,
    // checkPhoneExists
};