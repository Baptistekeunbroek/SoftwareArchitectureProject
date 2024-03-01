const {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByParkId,
  findBowlingByParkId,
  findProductByIdAndParkId,
} = require("../database/products");
const passport = require("passport");
const apiSessions = require("../utils/apiSessions");
const router = require("express").Router();

router.post(
  "/",
  passport.authenticate(["admin"], { session: false }),
  (req, res) => {
    const { parkId, name, price, type } = req.body;
    if (!parkId || !name || !price || !type) {
      return res
        .status(400)
        .json({ message: "All fields are required", ok: false });
    }
    const product = createProduct(parkId, name, price, type);
    res.status(200).json({ ok: true, product });
  }
);

router.get(
  "/getCatalogForQRCode",
  passport.authenticate(["user", "admin"], { session: false }),
  async (req, res) => {
    const qrCode = req.query.qrCode;
    const session = await apiSessions.get(`/qrCode/${qrCode}`);
    if (!session.ok)
      return res.status(400).json({ message: session.message, ok: false });
    const products = getProductsByParkId(session.session.parkId);
    res.status(200).json({ ok: true, products });
  }
);

router.get("/", (req, res) => {
  const products = getProducts();
  res.status(200).json({ ok: true, products });
});

router.get(
  "/findBowlingByParkId",
  passport.authenticate(["session"], { session: false }),
  (req, res) => {
    const parkId = req.query.parkId;
    if (!parkId)
      return res
        .status(400)
        .json({ message: "Park ID is required", ok: false });
    const product = findBowlingByParkId(parseInt(parkId, 10));
    if (!product)
      return res.status(400).json({ message: "Bowling not found", ok: false });
    res.status(200).json({ ok: true, product });
  }
);

router.get(
  "/findProductByIdAndParkId",
  passport.authenticate(["session"], { session: false }),
  (req, res) => {
    const parkId = req.query.parkId;
    const productId = req.query.productId;
    if (!parkId || !productId)
      return res
        .status(400)
        .json({ message: "Park ID & Product ID are required", ok: false });
    const product = findProductByIdAndParkId(
      parseInt(parkId, 10),
      parseInt(productId, 10)
    );
    if (!product)
      return res.status(400).json({ message: "Product not found", ok: false });
    res.status(200).json({ ok: true, product });
  }
);

router.delete(
  "/:productId",
  passport.authenticate(["admin"], { session: false }),
  (req, res) => {
    const productId = req.params.productId;
    if (!productId)
      return res
        .status(400)
        .json({ message: "Product ID is required", ok: false });
    const deleted = deleteProduct(parseInt(productId, 10));
    if (!deleted)
      return res.status(400).json({ message: "Product not found", ok: false });
    res.status(200).json({ message: "Product deleted", ok: true });
  }
);

module.exports = router;
