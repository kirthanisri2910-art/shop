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
    p.id === id ? updatedProduct : p
  );

  saveProducts(updated);
};