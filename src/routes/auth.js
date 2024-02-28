const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { users } = require("../config/database");

// In-memory storage for users

router.get("/", (req, res) => {
  res.json(users);
});

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  // Assume validation of input data here

  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Simulate creating a new user id by getting the length of the users array
  const newUser = new User(
    users.length + 1,
    username,
    email,
    password,
    role // Set the role property here
  );
  users.push(newUser); // Add the new user to the global users array

  return res.status(201).json(newUser); // Respond with the created user
});
// Login user

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if the provided password matches the stored password
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // If email and password are correct, return success message and user data
  res.json({ message: "Login successful", user });
});

module.exports = router;
