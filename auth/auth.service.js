const User = require("../users/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const AuthService = {
  register: async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  },

  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user, token };
  },
};

module.exports = AuthService;
