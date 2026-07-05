const { Router } = require("express");
const ProductService = require("./product.service");

const productRouter = new Router();

productRouter.get("/", async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

productRouter.get("/category/:categoryName", async (req, res) => {
  try {
    const products = await ProductService.getProductsByCategory(
      req.params.categoryName,
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

productRouter.get("/:key", async (req, res) => {
  try {
    const product = await ProductService.getProductByKey(req.params.key);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = productRouter;
