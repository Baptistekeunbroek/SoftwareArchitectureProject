const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Place an order
router.post("/place", async (req, res) => {
  const { items, customerInfo, parkId, alleyNumber } = req.body;
  try {
    const newOrder = new Order({
      items,
      customerInfo,
      parkId,
      alleyNumber,
    });
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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
