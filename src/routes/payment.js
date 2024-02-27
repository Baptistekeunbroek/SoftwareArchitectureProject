const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe-config");
const { orders } = require("./orders");

const calculateTotalAmount = (order) => {
  let total = 0;
  order.items.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
};

router.post("/payForSelf", async (req, res) => {
  const { orderId } = req.body;
  const order = orders.find((order) => order.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  const totalAmount = calculateTotalAmount(order);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "eur",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Error processing payment" });
  }
});

router.post("/payForGroup", async (req, res) => {
  const { orderId } = req.body;
  const order = orders.find((order) => order.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  const totalAmount = calculateTotalAmount(order);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "eur",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Error processing payment" });
  }
});

router.post("/paySpecificAmount", async (req, res) => {
  const { orderId, amount } = req.body;
  const order = orders.find((order) => order.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "eur",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Error processing payment" });
  }
});

module.exports = router;
