const KEY = "damages";

export const getDamages = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};


export const saveDamages = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

