const products = [
  {
    id: 1,
    name: "Bowling Ticket",
    price: 20,
    type: "Ticket",
  },
  {
    id: 2,
    name: "Coca-Cola",
    price: 8,
    type: "Drink",
  },
  {
    id: 3,
    name: "Peanuts",
    price: 5,
    type: "Snack",
  },
  {
    id: 4,
    name: "French fries",
    price: 10,
    type: "Snack",
  },
  {
    id: 5,
    name: "Popcorn",
    price: 9,
    type: "Snack",
  },
];

let nextProductId = products.length + 1;

const findProductById = (productId) =>
  products.find((product) => product.id === productId);

const createProduct = (name, price, type) => {
  const product = {
    id: nextProductId,
    name,
    price,
    type,
  };
  products.push(product);
  nextProductId++;
  return product;
};

const getProducts = () => products;

const deleteProduct = (productId) => {
  const index = products.findIndex((product) => product.id === productId);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

module.exports = {
  findProductById,
  createProduct,
  getProducts,
  deleteProduct,
};
