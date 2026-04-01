const KEY = "sales";

export const getSales = () => {
  try {
      const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading sales:", error);
    return [];
  }
};
 

export const saveSales = (sales) => {
  localStorage.setItem(KEY, JSON.stringify(sales));
};