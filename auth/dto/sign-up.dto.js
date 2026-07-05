const { default: z } = require("zod");

const signUpDto = z.object({
  name: z.string().min(2, "Name must be at least 2 char"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 char"),
});

module.exports = { signUpDto };
