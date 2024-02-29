const express = require("express");
const router = express.Router();
const { Product, products } = require("../database/products");
//const { isAgent } = require("../config/passport-config");

// Get all products
router.get("/", (req, res) => {
  res.json(products);
});

// Add a new product
router.post("/add", (req, res) => {
  const { name, price, description, category } = req.body;
  const newProduct = new Product(
    products.length + 1,
    name,
    price,
    description,
    category
  );
  products.push(newProduct);
  res.json(newProduct);
});

// Update an existing product
router.put("/update/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, description, category } = req.body;
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products[index] = { id: productId, name, price, description, category };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Delete a product
router.delete("/delete/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1)[0];
    res.json(deletedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

module.exports = router;
