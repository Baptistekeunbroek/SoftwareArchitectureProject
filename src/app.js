const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const paymentRouter = require("./routes/payment");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

// Session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/payment", paymentRouter);

module.exports = app;
