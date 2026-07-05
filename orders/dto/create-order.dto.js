const { z } = require("zod");

const createOrderDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-]{7,15}$/, "Invalid phone number format"),
  address: z.string().min(5, "Address must be at least 5 characters long"),

  zip: z
    .string()
    .regex(/^[0-9]+$/, "ZIP code must contain only numbers")
    .min(3, "Too short"),

  city: z
    .string()
    .regex(/^[a-zA-Zა-ჰა-ჰწჭხჯჰ\s]+$/, "City must contain only letters")
    .min(2, "Too short"),

  country: z
    .string()
    .regex(/^[a-zA-Zა-ჰა-ჰწჭხჯჰ\s]+$/, "Country must contain only letters")
    .min(2, "Too short"),
  paymentMethod: z.enum(["e-money", "cash"]),
  totalPrice: z.number().min(1, "Total price is required"),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
      })
    )
    .min(1, "Cart cannot be empty"),
});

module.exports = { createOrderDto };