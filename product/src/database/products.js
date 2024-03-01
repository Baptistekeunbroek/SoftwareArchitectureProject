const products = [
  {
    id: 1,
    parkId: 1,
    name: "Bowling Game",
    price: 100,
    type: "bowling",
  },
  {
    id: 2,
    parkId: 1,
    name: "Drink",
    price: 200,
    type: "snack",
  },
  {
    id: 3,
    parkId: 1,
    name: "Snack",
    price: 300,
    type: "snack",
  },
  {
    id: 4,
    parkId: 1,
    name: "French fries",
    price: 400,
    type: "snack",
  },
  {
    id: 5,
    parkId: 1,
    name: "Crisps",
    price: 500,
    type: "snack",
  },
];

let nextProductId = 6;

const findBowlingByParkId = (parkId) =>
  products.find(
    (product) => product.parkId === parkId && product.type === "bowling"
  );

const findProductByIdAndParkId = (parkId, productId) =>
  products.find(
    (product) => product.parkId === parkId && product.id === productId
  );

const createProduct = (parkId, name, price, type) => {
  const product = {
    id: nextProductId,
    parkId,
    name,
    price,
    type,
  };
  products.push(product);
  nextProductId++;
  return product;
};

const getProducts = () => products;

const getProductsByParkId = (parkId) =>
  products.filter((product) => product.parkId === parkId);

const deleteProduct = (productId) => {
  const index = products.findIndex((product) => product.id === productId);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

module.exports = {
  getProductsByParkId,
  findBowlingByParkId,
  findProductByIdAndParkId,
  createProduct,
  getProducts,
  deleteProduct,
};
