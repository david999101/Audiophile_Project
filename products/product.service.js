const Product = require("./product.model");

const ProductService = {
  getAllProducts: async () => {
    return await Product.find();
  },

  getProductsByCategory: async (categoryName) => {
    return await Product.find({ category: categoryName });
  },

  getProductByKey: async (key) => {
    return await Product.findOne({ key: key });
  }
};

module.exports = ProductService;