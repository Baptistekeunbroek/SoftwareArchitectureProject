const express = require("express");
const router = express.Router();
const { Product } = require("../models/Product");

// In-memory storage for orders
let orders = [];
let basket = [];

// Add products to the basket
router.post("/addToBasket", (req, res) => {
  const { productId, quantity } = req.body;

  // Check if the productId is valid (you can add further validation if needed)
  if (typeof productId !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid productId or quantity" });
  }

  // Check if the product is already in the basket
  const existingProductIndex = basket.findIndex(
    (item) => item.productId === productId
  );

  if (existingProductIndex !== -1) {
    // If product already exists, update its quantity
    basket[existingProductIndex].quantity += quantity;
  } else {
    // If product doesn't exist, add it to the basket
    basket.push({ productId, quantity });
  }

  res.json({ message: "Product added to basket successfully" });
});

// View basket
router.get("/viewBasket", (req, res) => {
  res.json(basket);
});

// Send order
router.post("/sendOrder", (req, res) => {
  const { name, email, phone, parkId, alleyNumber } = req.body;

  // Validate the necessary information
  if (!name || !email || !parkId || !alleyNumber) {
    return res.status(400).json({ message: "Missing required information" });
  }

  if (basket.length === 0) {
    return res.status(400).json({ message: "Basket is empty" });
  }

  // Create a new order object
  const newOrder = {
    id: orders.length + 1, // Simple incrementing ID, consider using UUIDs in real application
    name,
    email,
    phone: phone || "", // Phone is optional
    parkId,
    alleyNumber,
    items: [...basket], // Copy the items from the basket
    createdAt: new Date(),
  };

  // Add the new order to the orders array
  orders.push(newOrder);

  // Clear the basket
  basket = [];

  res.json({ message: "Order sent successfully", orderId: newOrder.id });
});

// List all orders
router.get("/", (req, res) => {
  res.json(orders);
});

module.exports = router;

/*

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
});*/
