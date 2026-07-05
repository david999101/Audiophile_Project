const User = require("./user.model");

const UserService = {
  register: async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const newUser = await User.create(userData);
    return newUser;
  },
};

module.exports = UserService;
