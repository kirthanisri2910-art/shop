import { useState, useEffect } from "react";
import ProductSelector from "../components/ProductSelector";
import Cart from "../components/Cart";
import Summary from "../components/Summary";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";


function Billing() {

  const [products, setProducts] = useState([
    { id: 1, name: "Tomatoes", price: 40, costPrice: 35, unit: "kg", stock: 12 },
    { id: 2, name: "Apples", price: 30, costPrice: 20, unit: "kg", stock: 20 },
    { id: 3, name: "Oranges", price: 50, costPrice: 45, unit: "kg", stock: 32 },
    { id: 4, name: "Mangoes", price: 80, costPrice: 70, unit: "kg", stock: 10 },
    { id: 5, name: "Onions", price: 35, costPrice: 30, unit: "kg", stock: 10 },
  ]);

  const [cart, setCart] = useState([]);
  const [billNo, setBillNo] = useState(Date.now());
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isSaved, setIsSaved] = useState(true);
  const [isPrinted, setIsPrinted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (cart.length > 0) {
      const draft = { cart, billNo, customerName, discount, gst, paymentMethod };
      localStorage.setItem('billDraft', JSON.stringify(draft));
    }
  }, [cart, customerName, discount, gst, paymentMethod, billNo]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('billDraft');
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.cart && parsed.cart.length > 0) {
        const loadDraft = window.confirm('Found unsaved bill. Do you want to continue?');
        if (loadDraft) {
          setCart(parsed.cart);
          setBillNo(parsed.billNo);
          setCustomerName(parsed.customerName || '');
          setDiscount(parsed.discount || 0);
          setGst(parsed.gst || 0);
          setPaymentMethod(parsed.paymentMethod || 'Cash');
          setIsSaved(false);
        } else {
          localStorage.removeItem('billDraft');
        }
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        newBill();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveBill();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [cart, isSaved, isPrinted]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Add to Cart
  const addToCart = (product, quantity) => {
    if (!product || quantity <= 0) return;
    if (product.stock < quantity) {
      showToast(`Only ${product.stock} ${product.unit} available!`, 'error');
      return;
    }
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id
        ? { ...c, quantity: c.quantity + quantity, total: (c.quantity + quantity) * c.price }
        : c
      ));
      showToast(`${product.name} quantity updated!`, 'success');
    } else {
      setCart([...cart, { ...product, quantity, total: quantity * product.price }]);
      showToast(`${product.name} added to cart!`, 'success');
    }
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - quantity } : p));
    setIsSaved(false);
  };

  const removeItem = (item) => {
    const confirmRemove = window.confirm(`Remove ${item.name} from cart?`);
    if (!confirmRemove) return;
    
    setCart(cart.filter(c => c.id !== item.id));
    setProducts(products.map(p => p.id === item.id ? { ...p, stock: p.stock + item.quantity } : p));
    setIsSaved(false);
    showToast(`${item.name} removed from cart`, 'info');
  };

  const newBill = () => {
    if (cart.length > 0 && (!isSaved || !isPrinted)) {
      setShowConfirmModal(true);
      return;
    }
    resetBill();
  };

  const resetBill = (silent = false) => {
    setCart([]);
    setBillNo(Date.now());
    setCustomerName("");
    setDiscount(0);
    setGst(0);
    setPaymentMethod("Cash");
    setIsSaved(true);
    setIsPrinted(false);
    localStorage.removeItem('billDraft');
    if (!silent) showToast('New bill started', 'info');
  };

  const handleSaveAndPrint = () => {
    saveBill(true);
    setShowConfirmModal(false);
    setTimeout(() => {
      window.print();
      setIsPrinted(true);
      resetBill(true);
    }, 500);
  };

  const handleSaveOnly = () => {
    saveBill();
    setShowConfirmModal(false);
    setTimeout(() => resetBill(true), 100);
  };

  const handleDiscard = () => {
    setShowConfirmModal(false);
    resetBill();
  };

  const saveBill = (silent = false) => {
    if (cart.length === 0) {
      if (!silent) showToast('Cart is empty!', 'error');
      return;
    }
    const billData = {
      billNo,
      customerName,
      cart,
      discount,
      gst,
      paymentMethod,
      date: new Date().toLocaleString()
    };
    console.log("Bill Saved:", billData);
    // TODO: Save to API
    setIsSaved(true);
    localStorage.removeItem('billDraft');
    if (!silent) showToast('Bill saved successfully!', 'success');
  };

  const handlePrintComplete = () => {
    setIsPrinted(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showConfirmModal && (
        <ConfirmModal
          onSaveAndPrint={handleSaveAndPrint}
          onSaveOnly={handleSaveOnly}
          onDiscard={handleDiscard}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-gray-800 text-2xl font-bold m-0">Billing System</h2>
        {!isSaved && cart.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-md text-sm font-semibold">
            ⚠️ Unsaved Changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Product Selector */}
        <div className="print:hidden">
          <div className="bg-white p-6 my-5 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-gray-800 flex items-center justify-between">
              Add Products
              {cart.length > 0 && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {cart.length} items in cart
                </span>
              )}
            </h3>
            <ProductSelector products={products} addToCart={addToCart} />
            
            {/* Quick Add Buttons */}
            <div className="mt-5">
              <h4 className="mb-2.5 text-sm text-gray-500">Quick Add</h4>
              <div className="flex gap-2 flex-wrap">
                {products.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p, 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    {p.name} +1
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white p-6 my-5 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-gray-800">Customer Details</h3>
            <input
              type="text"
              placeholder="Customer Name / Phone Number (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 my-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Discount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full p-3 my-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">GST (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={gst}
                  onChange={(e) => setGst(Number(e.target.value))}
                  className="w-full p-3 my-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="mt-2.5">
              <label className="text-sm text-gray-500 block mb-1">Payment</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-3 my-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Bill Preview */}
        <div>
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="text-center mb-5 border-b-2 border-gray-200 pb-4">
              <h2 className="my-1 text-gray-800 text-xl font-bold">{localStorage.getItem('shopName') || 'My Shop'}</h2>
              <p className="my-1 text-sm text-gray-500">{localStorage.getItem('shopAddress') || ''}</p>
              <p className="my-1 text-sm text-gray-500">{localStorage.getItem('shopPhone') || ''}</p>
              <div className="flex justify-between mt-2.5 text-sm">
                <span><strong>Bill:</strong> #{billNo}</span>
                <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
              </div>
              {customerName && <p className="my-1 text-sm"><strong>Customer:</strong> {customerName}</p>}
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No items in cart</p>
                <p className="text-sm">Add products to start billing</p>
              </div>
            ) : (
              <>
                <Cart cart={cart} removeItem={removeItem} />
                <Summary 
                  cart={cart} 
                  discount={discount}
                  gst={gst}
                  paymentMethod={paymentMethod}
                  newBill={newBill} 
                  saveBill={saveBill}
                  isSaved={isSaved}
                  isPrinted={isPrinted}
                  onPrintComplete={handlePrintComplete}
                />
              </>
            )}
          </div>
          
          {/* Shortcuts Info */}
          <div className="print:hidden mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-500">
            <strong>Shortcuts:</strong> F2 = New Bill | Ctrl+S = Save | Enter = Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;