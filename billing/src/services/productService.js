const API_URL = "https://script.google.com/macros/s/AKfycbzq2SAyP2EbTwo1HdYhJQpPIauygAjugnqP6gVlwPzbsWutHfYcB3shNg9q29IUJzRO/exec";

const KEY = "products";

export const getProducts = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveProducts = (products) => {
  localStorage.setItem(KEY, JSON.stringify(products));
};

export const updateProduct = (id, updatedProduct) => {
  const products = getProducts();

  const updated = products.map(p =>
    Number(p.id) === Number(id) ? updatedProduct : p
  );

  saveProducts(updated);
};


// 🔥 GOOGLE SHEET - ADD
export const addProductToSheet = async (product) => {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "addProduct",
      ...product
    })
  });

  return res.json();
};

// 🔥 GOOGLE SHEET - GET
export const fetchProductsFromSheet = async (shopId) => {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getProducts",
      shopId
    })
  });

  return res.json();
};