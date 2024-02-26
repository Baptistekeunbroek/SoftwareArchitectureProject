const express = require("express");
const router = express.Router();
const { products } = require("../models/Product");

// In-memory storage for orders
let orders = [];

// Place an order
router.post("/place", (req, res) => {
  const { items, customerInfo, parkId, alleyNumber } = req.body;
  // Here you can validate items, customerInfo, etc.
  const order = { items, customerInfo, parkId, alleyNumber };
  orders.push(order);
  res.json(order);
});

// List all orders
router.get("/", (req, res) => {
  res.json(orders);
});

module.exports = router;

module.exports = router;

const stripe = require("stripe")("your_stripe_secret_key");

router.post("/payment", async (req, res) => {
  const { amount, source } = req.body;
  try {
    const charge = await stripe.charges.create({
      amount: amount, // Amount in cents
      currency: "usd",
      source: source,
      description: "Order payment",
    });
    res.json(charge);
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment Error");
  }
});

module.exports = router;
