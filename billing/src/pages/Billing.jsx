import { useState, useEffect } from "react";
import ProductSelector from "../components/ProductSelector";
import Cart from "../components/Cart";
import Summary from "../components/Summary";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import "../billing.css";

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
  }, []);

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
    setTimeout(() => {
      window.print();
      setIsPrinted(true);
      setShowConfirmModal(false);
      setTimeout(() => resetBill(true), 300);
    }, 100);
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
    <div className="container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showConfirmModal && (
        <ConfirmModal
          onSaveAndPrint={handleSaveAndPrint}
          onSaveOnly={handleSaveOnly}
          onDiscard={handleDiscard}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 className="no-print" style={{ color: "#1f2937", margin: 0 }}>Billing System</h2>
        {!isSaved && cart.length > 0 && (
          <span className="no-print" style={{ 
            background: '#fef3c7', 
            color: '#92400e', 
            padding: '6px 12px', 
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            ⚠️ Unsaved Changes
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }} className="billing-grid">
        
        {/* Left: Product Selector */}
        <div className="no-print billing-left">
          <div className="box">
            <h3 style={{ marginBottom: "15px", color: "#1f2937", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Add Products
              {cart.length > 0 && (
                <span style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {cart.length} items in cart
                </span>
              )}
            </h3>
            <ProductSelector products={products} addToCart={addToCart} />
            
            {/* Quick Add Buttons */}
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "#6b7280" }}>Quick Add</h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {products.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p, 1)}
                    className="btn-primary"
                    style={{ fontSize: "12px", padding: "8px 12px" }}
                  >
                    {p.name} +1
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="box">
            <h3 style={{ marginBottom: "15px", color: "#1f2937" }}>Customer Details</h3>
            <input
              type="text"
              placeholder="Customer Name / Phone Number (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="customer-grid">
              <div>
                <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "5px" }}>Discount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "5px" }}>GST (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={gst}
                  onChange={(e) => setGst(Number(e.target.value))}
                />
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "5px" }}>Payment</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Bill Preview */}
        <div className="billing-right">
          <div className="print-area">
            <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: "2px solid #e5e7eb", paddingBottom: "15px" }}>
              <h2 style={{ margin: "5px 0", color: "#1f2937" }}>{localStorage.getItem('shopName') || 'My Shop'}</h2>
              <p style={{ margin: "3px 0", fontSize: "13px", color: "#6b7280" }}>{localStorage.getItem('shopAddress') || ''}</p>
              <p style={{ margin: "3px 0", fontSize: "13px", color: "#6b7280" }}>{localStorage.getItem('shopPhone') || ''}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "13px" }}>
                <span><strong>Bill:</strong> #{billNo}</span>
                <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
              </div>
              {customerName && <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Customer:</strong> {customerName}</p>}
            </div>
            
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                <p>No items in cart</p>
                <p style={{ fontSize: "13px" }}>Add products to start billing</p>
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
          <div className="no-print" style={{ marginTop: "15px", padding: "12px", background: "#f3f4f6", borderRadius: "8px", fontSize: "12px", color: "#6b7280" }}>
            <strong>Shortcuts:</strong> F2 = New Bill | Ctrl+S = Save | Enter = Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;