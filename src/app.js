const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRouter = require("./routes/auth");
const app = express();

// Session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouter);
app.use("/api/orders", require("./routes/orders"));
app.use("/api/auth", require("./routes/auth"));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
