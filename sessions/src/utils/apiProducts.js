class ApiProducts {
  constructor() {
    this.BASE_URL = process.env.PRODUCTS_API_URL;
  }

  async get(endpoint) {
    const url = `${this.BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });
    const data = await response.json();
    return data;
  }

  async post(endpoint, body) {
    const url = `${this.BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }

  async remove(endpoint) {
    const url = `${this.BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });
    const data = await response.json();
    return data;
  }
}

const apiProducts = new ApiProducts();

module.exports = apiProducts;
