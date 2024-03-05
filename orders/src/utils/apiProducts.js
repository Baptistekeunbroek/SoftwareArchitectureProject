class ApiProducts {
  constructor() {
    this.BASE_URL = process.env.PRODUCTS_API_URL;
  }

  async fetchWithJSONCheck(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `API call to ${options.method} ${url} failed with status: ${response.status}`
      );
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text(); // Read response body as text first
      try {
        return JSON.parse(text); // Try to parse text as JSON
      } catch (error) {
        throw new Error(
          `Failed to parse JSON response from ${options.method} ${url}: ${text}`
        );
      }
    } else {
      throw new Error(
        `Unexpected content type received from ${options.method} ${url}: ${contentType}`
      );
    }
  }

  async get(endpoint) {
    const url = `${this.BASE_URL}${endpoint}`;
    return this.fetchWithJSONCheck(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });
  }

  // Repeat for post and remove methods, adjusting options as needed
  async post(endpoint, body) {
    const url = `${this.BASE_URL}${endpoint}`;
    return this.fetchWithJSONCheck(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
      },
      body: JSON.stringify(body),
    });
  }

  async remove(endpoint) {
    const url = `${this.BASE_URL}${endpoint}`;
    return this.fetchWithJSONCheck(url, {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });
  }
}

const apiProducts = new ApiProducts();

module.exports = apiProducts;
