const express = require("express");
const router = express.Router();
const User = require("../models/User");

// In-memory storage for users
let users = [];

// Register a new user
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  // Here you can validate username, email, password, etc.
  const newUser = new User(users.length + 1, username, email, password);
  users.push(newUser);
  res.json(newUser);
});

// Login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
