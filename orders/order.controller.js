const { Router } = require("express");
const orderService = require("./order.service");
const validate = require("../middlewares/validate");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const { createOrderDto } = require("./dto/create-order.dto");

const orderRouter = new Router();

orderRouter.post(
  "/",
  isAuthMiddleware,
  validate(createOrderDto),
  async (req, res) => {
    try {
      const orderData = req.body;

      orderData.userId = req.user.userId;

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
  },
);

module.exports = orderRouter;
