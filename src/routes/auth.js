const express = require("express");
const router = express.Router();

// In-memory storage for users
let users = [];

// Register a new user
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
  };
  users.push(newUser);
  res.json(newUser);
});

// Get all users (for testing purposes)
router.get("/", (req, res) => {
  res.json(users);
});

module.exports = router;
