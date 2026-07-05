const { Router } = require("express");
const UserService = require("./user.service");
const validate = require("../middlewares/validate");
const { signUpDto } = require("./dto/sign-up.dto");

const userRouter = new Router();

userRouter.post("/signup", validate(signUpDto), async (req, res) => {
  try {
    const newUser = await UserService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = userRouter;
