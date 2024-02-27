const Product = require("../models/product");

const products = [
  new Product(1, "Bowling Ticket", 15, "Ticket to play bowling", "Ticket"),
  new Product(2, "Drink", 3.5, "Refreshing beverage", "Beverages"),
  new Product(3, "Snack", 5.0, "Delicious snack", "Snacks"),
  new Product(4, "Dessert", 7.99, "Sweet treat", "Desserts"),
];

module.exports = {
  products,
};
