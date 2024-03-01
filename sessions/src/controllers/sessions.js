const router = require("express").Router();
const passport = require("passport");
const {
  createSession,
  getSessions,
  joinSession,
  sessionPayment,
  orderProduct,
} = require("../database/sessions");

// Middleware for session authentication
const authenticateSession = passport.authenticate("session", {
  session: false,
});

// Middleware for user or admin authentication
const authenticateUserOrAgent = passport.authenticate(["agent"], {
  session: false,
});

router.post("/", authenticateUserOrAgent, async (req, res) => {
  try {
    console.log("Query Params:", req.query); // Log query parameters
    console.log("Body:", req.body);
    const user = req.user;
    // Adjusted to read parkId from the request body
    const parkId = parseInt(req.body.parkId, 10);
    if (!parkId) {
      return res
        .status(400)
        .json({ message: "Park ID is required", ok: false });
    }
    const session = await createSession(user.id, parkId);
    if (!session) {
      return res
        .status(400)
        .json({ message: "No free alley available", ok: false });
    }
    res.status(200).json({ message: "Session created", ok: true, session });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Internal server error", ok: false });
  }
});

router.get(
  "/",
  authenticateUserOrAgent, // Apply user or admin authentication
  (req, res) => {
    const sessions = getSessions();
    res.status(200).json({ ok: true, sessions });
  }
);

router.get(
  "/qrCode/:qrCode",
  authenticateSession, // Apply session authentication
  (req, res) => {
    const sessions = getSessions();
    const qrCode = req.params.qrCode;
    if (!qrCode)
      return res
        .status(400)
        .json({ message: "QR Code is required", ok: false });
    const session = sessions.find((session) => session.qrCode === qrCode);
    if (!session)
      return res.status(400).json({ message: "Session not found", ok: false });
    res.status(200).json({ ok: true, session });
  }
);

router.post(
  "/join/:qrCode",
  passport.authenticate("agent", { session: false }), // Apply admin authentication
  (req, res) => {
    const user = req.user;
    const parkId = parseInt(req.query.parkId, 10);
    const qrCode = req.params.qrCode;
    if (!parkId || !qrCode)
      return res
        .status(400)
        .json({ message: "Park ID & qrCode are required", ok: false });
    const session = joinSession(qrCode, user.id, parkId);
    if (!session)
      return res.status(400).json({ message: "Session not found", ok: false });
    res.status(200).json({ message: "Session joined", ok: true, session });
  }
);

router.post(
  "/order/:qrCode",
  authenticateUserOrAgent, // Apply user or admin authentication
  async (req, res) => {
    const user = req.user;
    const qrCode = req.params.qrCode;
    if (!qrCode)
      return res
        .status(400)
        .json({ message: "QR Code is required", ok: false });
    const productId = parseInt(req.query.productId, 10);
    if (!productId)
      return res
        .status(400)
        .json({ message: "Product ID is required", ok: false });
    const session = await orderProduct(qrCode, user.id, productId);
    if (!session)
      return res.status(400).json({ message: "Session not found", ok: false });
    res.status(200).json({ message: "Product order done", ok: true, session });
  }
);

router.post(
  "/payment/:qrCode",
  authenticateUserOrAgent, // Apply user or admin authentication
  (req, res) => {
    const user = req.user;
    const amount = parseInt(req.query.amount, 10);
    const qrCode = req.params.qrCode;
    if (!amount)
      return res.status(400).json({ message: "Amount is required", ok: false });
    const session = sessionPayment(qrCode, user.id, amount);
    if (!session.ok)
      return res.status(400).json({ message: session.message, ok: false });
    res
      .status(200)
      .json({ message: "Payment done", ok: true, session: session.session });
  }
);

module.exports = router;
