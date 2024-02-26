// routes/payment.js
const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe-config");

// Dummy endpoint for processing payment
router.post("/process-payment", async (req, res) => {
  const { amount, currency, source, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      source,
      description,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
});

module.exports = router;
