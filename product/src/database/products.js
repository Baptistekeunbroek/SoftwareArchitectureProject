class Product {
  constructor(id, name, price, description, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
  }
}

const products = [
  new Product(1, "Bowling Ticket", 15, "Ticket to play bowling", "Ticket"),
  new Product(2, "Drink", 3.5, "Refreshing beverage", "Beverages"),
  new Product(3, "Snack", 5.0, "Delicious snack", "Snacks"),
  new Product(4, "Dessert", 7.99, "Sweet treat", "Desserts"),
];

module.exports = { Product, products };
