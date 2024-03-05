const router = require("express").Router();
const passport = require("passport");
const {
  createSession,
  getSessions,
  joinSession,
  leaveSession,
  getSessionsByParkId,
  findSessionByQrCode,
  findSessionByUserId,
  deleteSession,
  addOrderToSession
} = require("../database/sessions");

router.get("/sessions", (req, res) => {
  const sessions = getSessions();
  res.json(sessions);
});

router.get("/sessions/:parkId", (req, res) => {
  const parkId = parseInt(req.params.parkId);
  const sessions = getSessionsByParkId(parkId);
  res.json(sessions);
});

router.post(
  "/session",
  passport.authenticate("customer", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const parkId = parseInt(req.body.parkId, 10);
      if (!parkId) {
        return res
          .status(400)
          .json({ error: "Park ID is required", ok: false });
      }
      const session = await createSession(userId, parkId);
      if (session.error) {
        return res
          .status(400)
          .json(session);
      }
      res.status(200).json({ message: "Session created", ok: true, session });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Internal server error", ok: false });
    }
  }
);

router.get("/session/qrCode/:qrCode", (req, res) => {
  const qrCode = req.params.qrCode;
  if (!qrCode)
    return res.status(400).json({ error: "QR Code is required", ok: false });
  const session = findSessionByQrCode(qrCode);
  if (!session)
    return res.status(400).json({ error: "Session not found", ok: false });
  res.status(200).json({ ok: true, session });
});

router.get("/session/user/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId)
    return res.status(400).json({ error: "UserId is required", ok: false });
  const session = findSessionByUserId(userId);
  if (!session)
    return res.status(400).json({ error: "Session not found", ok: false });
  res.status(200).json({ ok: true, session });
});

router.post(
  "/join/:qrCode",
  passport.authenticate("customer", { session: false }),
  async (req, res) => {
    const user = req.user;
    const qrCode = req.params.qrCode;
    if (!qrCode)
      return res.status(400).json({ error: "qrCode is required", ok: false });
    const session = await joinSession(qrCode, user.id);
    if (session.error)
      return res.status(400).json(session);
    res.status(200).json({ message: "Session joined", ok: true, session });
  }
);

router.post(
  "/leave/:qrCode",
  passport.authenticate("customer", { session: false }),
  async (req, res) => {
    const user = req.user;
    const qrCode = req.params.qrCode;
    if (!qrCode)
      return res.status(400).json({ error: "qrCode is required", ok: false });
    const session = await leaveSession(qrCode, user.id);
    if (session.error)
      return res.status(400).json(session);
    res.status(200).json({ message: "Session left", ok: true, session });
  }
);

router.delete("/session/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!id)
    return res.status(400).json({ error: "Session ID is required", ok: false });
  const result = deleteSession(id);
  if (result.error) return res.status(400).json(result);
  else res.status(200).json(result)
});

router.post("/session/order", async (req, res) => {
    const order = req.body.order;
    const sessionId = parseInt(req.body.sessionId);
    if (!order)
      return res.status(400).json({ error: "Order is required", ok: false });
    if (!sessionId)
      return res.status(400).json({ error: "SessionId is required", ok: false });
    const result = addOrderToSession(order, sessionId);
    if (result.error) return res.status(400).json(result);
    else res.status(200).json(result)
  }
);

module.exports = router;
