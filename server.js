const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { z } = require("zod");

const orderController = require("./orders/order.controller");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI =
  process.env.MONGO_URL || "mongodb://localhost:27017/audiophile_db";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB via ENV"))
  .catch((err) => console.error("MongoDB connection error:", err));

const orderValidationSchema = z.object({
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
      }),
    )
    .min(1, "Cart cannot be empty"),
});

const productSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  features: { type: String },
  includes: [
    {
      quantity: { type: Number },
      item: { type: String },
    },
  ],
  gallery: {
    first: { type: String },
    second: { type: String },
    third: { type: String },
  },
});

const Product = mongoose.model("Product", productSchema);

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.post("/api/orders", (req, res) => {
  const result = orderValidationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: result.error.flatten().fieldErrors,
    });
  }

  orderController.handleCreateOrder(req, res);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

app.get("/api/products/category/:categoryName", async (req, res) => {
  try {
    const products = await mongoose
      .model("Product")
      .find({ category: req.params.categoryName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/products/:key", async (req, res) => {
  try {
    const product = await Product.findOne({ key: req.params.key });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
