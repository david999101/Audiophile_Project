const Order = require("./order.model");

const createOrder = async (orderData) => {
  const newOrder = await Order.create(orderData);
  return newOrder;
};

module.exports = {
  createOrder,
};
