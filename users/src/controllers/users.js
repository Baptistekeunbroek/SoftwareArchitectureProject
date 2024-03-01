const express = require("express");
const router = express.Router();
const { users } = require("../database/users");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.json(users);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((user) => user.email === email);
  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  // Validate credentials
  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({ token });
});

router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = users.find((user) => user.email === email);
  if (user) return res.status(400).json({ message: "User already exists" });
  //const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User(users.length + 1, email, password, name, role);
  users.push(newUser);
  res.json(newUser);
});

router.get("/agent", (req, res) => {
  const userId = parseInt(req.query.id); // Convert to integer
  const user = users.find(
    (user) => user.id === userId && user.role === "agent"
  );
  if (!user) return res.status(404).json({ message: "Agent not found" });
  res.json(user);
});

router.get("/user", (req, res) => {
  const userId = parseInt(req.query.id); // Convert to integer
  const user = users.find((user) => user.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.get("/customer", (req, res) => {
  const userId = parseInt(req.query.id); // Convert to integer
  const user = users.find(
    (user) => user.id === userId && user.role === "customer"
  );
  if (!user) return res.status(404).json({ message: "Customer not found" });
  res.json(user);
});

module.exports = router;
