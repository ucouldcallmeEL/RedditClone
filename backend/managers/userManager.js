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

// Find user by email
const findByEmail = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
};

// Find user by username (name field)
const findByUsername = async (username) => {
    const user = await User.findOne({ name: username });
    return user;
};

// Find user by phone number
const findByPhone = async (phone) => {
    const user = await User.findOne({ phone: phone });
    return user;
};

// Find user by email or username
const findByEmailOrUsername = async (identifier) => {
    // Try to find by email first (case-insensitive)
    let user = await User.findOne({ email: identifier.toLowerCase() });
    if (user) return user;
    
    // If not found by email, try to find by username (name field)
    user = await User.findOne({ name: identifier });
    return user;
};

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    getusersByCommunity,
    findByEmail,
    findByUsername,
    findByPhone,
    findByEmailOrUsername
};