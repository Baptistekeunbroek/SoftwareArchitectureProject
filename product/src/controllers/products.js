const {
  createProduct,
  deleteProduct,
  getProducts,
  findProductById,
} = require("../database/products");
const passport = require("passport");
const apiSessions = require("../utils/apiSessions");
const router = require("express").Router();

// Get all products
router.get("/", (req, res) => {
  const products = getProducts();
  res.json(products);
});

//Get a product by ID
router.get("/:productId", (req, res) => {
  const productId = req.params.productId;
  if (!productId)
    return res
      .status(400)
      .json({ message: "Product ID is required", ok: false });
  const product = findProductById(parseInt(productId, 10));
  if (!product)
    return res.status(400).json({ message: "Product not found", ok: false });
  res.status(200).json({ ok: true, product });
});

// Create a new product
router.post(
  "/",
  passport.authenticate(["agent"], { session: false }),
  (req, res) => {
    const { name, price, type } = req.body;
    if (!name || !price || !type) {
      return res
        .status(400)
        .json({ message: "All fields are required", ok: false });
    }
    const product = createProduct(name, price, type);
    res.status(200).json({ ok: true, product });
  }
);

// Delete a product
router.delete(
  "/:productId",
  passport.authenticate(["agent"], { session: false }),
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

//Update a product
router.put(
  "/:productId",
  passport.authenticate(["agent"], { session: false }),
  (req, res) => {
    const productId = req.params.productId;
    const { name, price, type } = req.body;
    if (!productId)
      return res
        .status(400)
        .json({ message: "Product ID is required", ok: false });
    const product = findProductById(parseInt(productId, 10));
    if (!product)
      return res.status(400).json({ message: "Product not found", ok: false });
    if (name) product.name = name;
    if (price) product.price = price;
    if (type) product.type = type;
    res.status(200).json({ message: "Product updated", ok: true, product });
  }
);

module.exports = router;

/*
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

router.get(
  "/getCatalogForQRCode",
  passport.authenticate(["user", "agent"], { session: false }),
  async (req, res) => {
    const qrCode = req.query.qrCode;
    const session = await apiSessions.get(`/qrCode/${qrCode}`);
    if (!session.ok)
      return res.status(400).json({ message: session.message, ok: false });
    const products = getProductsByParkId(session.session.parkId);
    res.status(200).json({ ok: true, products });
  }
);
*/
