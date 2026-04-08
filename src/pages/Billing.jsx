import { useState, useEffect, useMemo } from "react";
import ProductSelector from "../components/ProductSelector";
import Cart from "../components/Cart";
import Summary from "../components/Summary";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import { getProducts, saveProducts } from "../services/productService";
import { getSales, saveSales } from "../services/salesService";
import { getDraft, saveDraft, clearDraft } from "../services/draftService";
import { getShopInfo } from "../services/shopService";
import { generateBillNo, applyStockChange, buildBillData, getTopSellingProducts, getBillableProducts } from "../utils/billingUtils";

function Billing() {
  const [products, setProducts] = useState([]);
  const [billableProducts, setBillableProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [billNo, setBillNo] = useState(() => generateBillNo());
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isSaved, setIsSaved] = useState(true);
  const [isPrinted, setIsPrinted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(null);

  const shop = useMemo(() => getShopInfo(), []);
  const quickAddProducts = useMemo(() => getTopSellingProducts(billableProducts), [billableProducts]);

  useEffect(() => {
    const all = getProducts();
    setProducts(all);
    setBillableProducts(getBillableProducts(all));
  }, []);

  useEffect(() => {
    if (cart.length > 0) saveDraft({ cart, billNo, customerName, discount, gst, paymentMethod });
  }, [cart, customerName, discount, gst, paymentMethod, billNo]);

  useEffect(() => {
    const draft = getDraft();
    if (!draft?.cart?.length) return;
    if (window.confirm("Found unsaved bill. Do you want to continue?")) {
      setCart(draft.cart);
      setBillNo(draft.billNo);
      setCustomerName(draft.customerName || "");
      setDiscount(draft.discount || 0);
      setGst(draft.gst || 0);
      setPaymentMethod(draft.paymentMethod || "Cash");
      setIsSaved(false);
    } else {
      clearDraft();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") { e.preventDefault(); newBill(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveBill(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, isSaved, isPrinted]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const addToCart = (product, quantity) => {
    if (!product || quantity <= 0) return;
    if (product.stock < quantity) {
      showToast(`Only ${product.stock} ${product.unit} available`, "error");
      return;
    }
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) {
        return prev.map(c => c.id === product.id
          ? { ...c, quantity: c.quantity + quantity, total: (c.quantity + quantity) * c.sellingPrice }
          : c
        );
      }
      return [...prev, { ...product, quantity, total: quantity * product.sellingPrice }];
    });
    showToast(`${product.name} added!`, "success");
    setIsSaved(false);
  };

  const updateQuantity = (item, newQty) => {
    if (newQty <= 0) return;
    const product = products.find(p => p.id === item.id);
    if (product && newQty > product.stock + item.quantity) {
      showToast(`Only ${product.stock + item.quantity} ${product.unit} available!`, "error");
      return;
    }
    setCart(cart.map(c => c.id === item.id ? { ...c, quantity: newQty, total: newQty * c.sellingPrice } : c));
    setIsSaved(false);
  };

  const removeItem = (item) => {
    if (!window.confirm(`Remove ${item.name} from cart?`)) return;
    setCart(cart.filter(c => c.id !== item.id));
    setIsSaved(false);
    showToast(`${item.name} removed`, "info");
  };

  const resetBill = (silent = false) => {
    setCart([]);
    setBillNo(generateBillNo());
    setCustomerName("");
    setDiscount(0);
    setGst(0);
    setPaymentMethod("Cash");
    setIsSaved(true);
    setIsPrinted(false);
    clearDraft();
    if (!silent) showToast("New bill started", "info");
  };

  const saveBill = (silent = false) => {
    if (cart.length === 0) { if (!silent) showToast("Cart is empty!", "error"); return; }
    if (isSaved) { if (!silent) showToast("Bill already saved!", "info"); return; }

    const stockError = cart.find(item => {
      const p = products.find(p => p.id === item.id);
      return p && p.stock < item.quantity;
    });
    if (stockError) { showToast(`Not enough stock for ${stockError.name}!`, "error"); return; }

    const billData = buildBillData({ billNo, customerName, cart, discount, gst, paymentMethod });
    const all = applyStockChange(products, cart, -1);
    setProducts(all);
    setBillableProducts(getBillableProducts(all));
    saveProducts(all);
    saveSales([billData, ...getSales()]);
    setIsSaved(true);
    clearDraft();
    if (!silent) showToast("Bill saved successfully!", "success");
  };

  const newBill = () => {
    if (cart.length > 0 && (!isSaved || !isPrinted)) { setShowConfirmModal(true); return; }
    resetBill();
  };

  const handleSaveAndPrint = () => {
    saveBill(true);
    setShowConfirmModal(false);
    setTimeout(() => { window.print(); setIsPrinted(true); resetBill(true); }, 500);
  };

  const handleSaveOnly = () => {
    saveBill();
    setShowConfirmModal(false);
    setTimeout(() => resetBill(true), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50">
    <div className="max-w-7xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showConfirmModal && (
        <ConfirmModal
          onSaveAndPrint={handleSaveAndPrint}
          onSaveOnly={handleSaveOnly}
          onDiscard={() => { setShowConfirmModal(false); resetBill(); }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h2 className="text-slate-800 text-2xl font-bold m-0">Billing</h2>
          <p className="text-slate-400 text-sm mt-1">Point of Sale Terminal</p>
        </div>
        {!isSaved && cart.length > 0 && (
          <span className="text-amber-500 text-sm font-medium flex items-center gap-1.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Unsaved Changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Product Selector */}
        <div className="print:hidden space-y-4">
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide m-0">Add Products</h3>
              {cart.length > 0 && (
                <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                  {cart.length} items
                </span>
              )}
            </div>
            <ProductSelector products={billableProducts} addToCart={addToCart} />

            <div className="mt-5">
              <h4 className="mb-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Quick Add</h4>
              <div className="flex gap-2 flex-wrap">
                {quickAddProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p, 1)}
                    className="bg-slate-100 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-200 hover:border-indigo-200"
                  >
                    {p.name} +1
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide mb-4">Customer & Payment</h3>
            <input
              type="text"
              placeholder="Customer Name / Phone (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 mb-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Discount (₹)</label>
                <input
                  type="number" placeholder="0" value={discount} min={0}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">GST (%)</label>
                <input
                  type="number" placeholder="0" value={gst} min={0}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setGst(Number(e.target.value))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Bill Preview */}
        <div>
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <div className="text-center mb-5 border-b border-slate-100 pb-4">
              <h2 className="my-1 text-slate-800 text-lg font-bold">{shop.shopName}</h2>
              <p className="my-0.5 text-xs text-slate-400">{shop.shopAddress}</p>
              <p className="my-0.5 text-xs text-slate-400">{shop.shopPhone}</p>
              <div className="flex justify-between mt-3 text-xs text-slate-500">
                <span>Bill: <span className="font-semibold text-slate-700">#{billNo}</span></span>
                <span>Date: <span className="font-semibold text-slate-700">{new Date().toLocaleDateString()}</span></span>
              </div>
              {customerName && <p className="my-1 text-xs text-slate-500">Customer: <span className="font-semibold text-slate-700">{customerName}</span></p>}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <svg className="mx-auto mb-3 opacity-30" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p className="text-sm font-medium">Cart is empty</p>
                <p className="text-xs mt-1">Add products to start billing</p>
              </div>
            ) : (
              <>
                <Cart cart={cart} removeItem={removeItem} updateQuantity={updateQuantity} />
                <Summary
                  cart={cart}
                  discount={discount}
                  gst={gst}
                  paymentMethod={paymentMethod}
                  newBill={newBill}
                  saveBill={saveBill}
                  isSaved={isSaved}
                  isPrinted={isPrinted}
                  onPrintComplete={() => setIsPrinted(true)}
                />
              </>
            )}
          </div>

          <div className="print:hidden mt-3 px-1 text-xs text-slate-400">
            F2 = New Bill &nbsp;|&nbsp; Ctrl+S = Save &nbsp;|&nbsp; Enter = Add to Cart
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Billing;
