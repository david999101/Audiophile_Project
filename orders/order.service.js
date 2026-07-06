const Order = require("./order.model");
const User = require("../users/user.model");
const Product = require("../products/product.model");

const createOrder = async (orderData) => {
  const user = await User.findById(orderData.userId);
  if (!user) {
    throw new Error("User not found. Cannot place order.");
  }

  let calculatedTotalPrice = 0;

  for (const item of orderData.items) {
    const dbProduct = await Product.findById(item.id);
    if (!dbProduct) {
      throw new Error(`Product with key ${item.id} not found`);
    }

    calculatedTotalPrice += dbProduct.price * item.quantity;
  }

  orderData.totalPrice = calculatedTotalPrice;

  const newOrder = await Order.create(orderData);

  user.orders.push(newOrder._id);
  await user.save();

  return newOrder;
};

module.exports = {
  createOrder,
};
