const orderService = require("./order.service");

const handleCreateOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const savedOrder = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("order error!:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleCreateOrder,
};
