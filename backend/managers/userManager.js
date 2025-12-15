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

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    getusersByCommunity
};