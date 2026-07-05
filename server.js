const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const orderRouter = require("./orders/order.controller");
const productRouter = require("./products/product.controller");

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

app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
