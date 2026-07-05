const { Router } = require("express");
const orderService = require("./order.service");
const { createOrderDto } = require("./dto/create-order.dto");

const orderRouter = new Router();

orderRouter.post("/", async (req, res) => {
  const result = createOrderDto.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: result.error.flatten().fieldErrors,
    });
  }

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
});

module.exports = orderRouter;
