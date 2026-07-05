const { Router } = require("express");
const AuthService = require("./auth.service");
const validate = require("../middlewares/validate");
const { signUpDto } = require("./dto/sign-up.dto");
const { signInDto } = require("./dto/sign-in.dto");

const authRouter = new Router();

authRouter.post("/signup", validate(signUpDto), async (req, res) => {
  try {
    const newUser = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

authRouter.post("/signin", validate(signInDto), async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = authRouter;
