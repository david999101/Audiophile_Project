const Order = require("./order.model");
const User = require("../users/user.model");

const createOrder = async (orderData) => {
  const newOrder = await Order.create(orderData);

  const user = await User.findById(orderData.userId);

  if (!user) {
  } else {
    user.orders.push(newOrder._id);
    await user.save();
  }

  return newOrder;
};

module.exports = {
  createOrder,
};
