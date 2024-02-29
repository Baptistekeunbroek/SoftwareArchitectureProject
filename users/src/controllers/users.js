const express = require("express");
const router = express.Router();
const { User, users } = require("../database/users");


router.get("/", (req, res) => {
  res.json(users);
});

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const newUser = new User(users.length + 1, username, email, password, role);
  users.push(newUser);

  return res.status(201).json(newUser);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = User.findByEmail(email);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  if (user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  return res.json(user);
});

module.exports = router;
