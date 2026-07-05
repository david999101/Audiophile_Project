const mongoose = require("mongoose");

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

module.exports = Product;
