import { getSales } from "../services/salesService";

export const generateBillNo = () => {
  const sales = getSales();
  if (sales.length === 0) return 1001;
  const billNos = sales.map(s => s.billNo).filter(n => n >= 1000 && n <= 99999);
  return billNos.length === 0 ? 1001 : Math.max(...billNos) + 1;
};

export const calcBillTotals = (cart, discount, gst) => {
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = Math.round((subtotal - discount) * gst / 100);
  const total = subtotal - discount + gstAmount;
  const profit = cart.reduce(
    (sum, item) => sum + ((item.price - (item.costPrice || 0)) * item.quantity), 0
  ) - discount;
  return { subtotal, gstAmount, total, profit };
};

export const applyStockChange = (products, cart, direction = -1) =>
  products.map(p => {
    const cartItem = cart.find(c => c.id === p.id);
    return cartItem ? { ...p, stock: p.stock + direction * cartItem.quantity } : p;
  });

export const getTopSellingProducts = (products) => {
  const sales = getSales();
  const count = {};
  sales.forEach(s => (s.cart || []).forEach(item => {
    count[item.id] = (count[item.id] || 0) + item.quantity;
  }));
  const sorted = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => products.find(p => p.id === Number(id)))
    .filter(Boolean);
  return sorted.length > 0 ? sorted : products.slice(0, 5);
};

export const buildBillData = ({ billNo, customerName, cart, discount, gst, paymentMethod }) => {
  const { subtotal, gstAmount, total, profit } = calcBillTotals(cart, discount, gst);
  return {
    id: `bill_${Date.now()}`,
    billNo,
    customerName,
    cart: cart.map(({ id, name, unit, price, costPrice = 0, quantity, total }) => ({
      id, name, unit, price, costPrice, quantity, total
    })),
    subtotal,
    discount,
    gst,
    gstAmount,
    total,
    profit,
    paymentMethod,
    date: new Date().toISOString()
  };
};
