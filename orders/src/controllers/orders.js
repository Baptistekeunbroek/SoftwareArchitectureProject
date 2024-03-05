const router = require("express").Router();
const passport = require("passport");
const {
  createEmptyOrder,
  getOrders,
  getOrdersBySessionId,
  getOrdersByUserId,
  findOrderById,
  getFinishedOrdersBySessionId,
  getFinishedOrdersByUserId,
  deleteOrder,
  findUnfinishedOrderByUserId,
  addProductToOrder,
  sendOrder,
  getFinishedOrdersByParkId
} = require("../database/order");

router.get("/orders", (req, res) => {
    const orders = getOrders();
    res.status(200).json(orders)
  }
);

router.get("/orders/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    if (!userId)
      return res.status(400).json({ error: "User Id is required", ok: false });
    const orders = getOrdersByUserId(userId);
    res.status(200).json(orders)
  }
);

router.get("/orders/session/:sessionId", (req, res) => {
    const sessionId = parseInt(req.params.sessionId);
    if (!sessionId)
      return res.status(400).json({ error: "Session Id is required", ok: false });
    const orders = getOrdersBySessionId(sessionId);
    res.status(200).json(orders)
  }
);

router.get("/orders/user/unfinished/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId)
    return res.status(400).json({ error: "User Id is required", ok: false });
  const order = findUnfinishedOrderByUserId(userId);
  res.status(200).json(order)
}
);

router.get("/orders/user/finished/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId)
    return res.status(400).json({ error: "User Id is required", ok: false });
  const orders = getFinishedOrdersByUserId(userId);
  res.status(200).json(orders)
}
);

router.get("/orders/session/finished/:sessionId", (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  if (!sessionId)
    return res.status(400).json({ error: "Session Id is required", ok: false });
  const orders = getFinishedOrdersBySessionId(sessionId);
  res.status(200).json(orders)
}
);

router.get("/orders/park/finished/:parkId", passport.authenticate("agent", { session: false }), (req, res) => {
  const parkId = parseInt(req.params.parkId);
  if (!parkId)
    return res.status(400).json({ error: "Park Id is required", ok: false });
  const orders = getFinishedOrdersByParkId(parkId);
  res.status(200).json(orders)
}
);

router.post(
  "/order",
  passport.authenticate("customer", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    const result = await createEmptyOrder(userId);
    if (result.error) return res.status(400).json(result);
    else res.status(200).json(result)
  }
);

router.get("/order/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!id)
      return res.status(400).json({ error: "Order Id is required", ok: false });
    const order = findOrderById(id);
    res.status(200).json(order)
  }
);

router.delete("/order/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!id)
    return res.status(400).json({ error: "Order Id is required", ok: false });
  const result = deleteOrder(id);
  if (result.error) return res.status(400).json(result);
  else res.status(200).json(result)
}
);

router.post(
  "/addProductToOrder",
  passport.authenticate("customer", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    if (!userId)
      return res.status(400).json({ error: "User Id is required", ok: false });
    const productId = parseInt(req.body.productId);
    if (!productId)
      return res.status(400).json({ error: "Product Id is required", ok: false });
    const number = parseInt(req.body.number);
    if (!number || number <= 0)
      return res.status(400).json({ error: "Valid number is required", ok: false });
    const result = await addProductToOrder(userId, productId, number);
    if (result.error) return res.status(400).json(result);
    else res.status(200).json(result)
  }
);

router.post(
  "/sendOrder",
  passport.authenticate("customer", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    if (!userId)
      return res.status(400).json({ error: "User Id is required", ok: false });
    const name = req.body.name;
    if (!name)
      return res.status(400).json({ error: "Name is required", ok: false });
    const email = req.body.email;
    if (!email)
      return res.status(400).json({ error: "Email is required", ok: false });
    const phoneNumber = req.body.phoneNumber;
    const result = await sendOrder(userId, name, email, phoneNumber);
    if (result.error) return res.status(400).json(result);
    else res.status(200).json(result)
  }
);



module.exports = router;
