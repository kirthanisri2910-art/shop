import { MdSave, MdPrint, MdRefresh } from "react-icons/md";

function Summary({ cart, discount = 0, paymentMethod, newBill, saveBill, gst = 0, isSaved = false, isPrinted = false, onPrintComplete }) {
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = (subtotal * gst) / 100;
  const totalAfterDiscount = subtotal - discount;
  const grandTotal = totalAfterDiscount + gstAmount;

  const handlePrint = () => {
    if (cart.length === 0) return;
    if (!isSaved) return;
    window.print();
    onPrintComplete?.();
    setTimeout(() => newBill(), 300);
  };

  return (
    <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "2px solid #e5e7eb" }}>
      <div style={{ fontSize: "15px", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span>Subtotal:</span>
          <span><strong>₹{subtotal}</strong></span>
        </div>
        {discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: "#10b981" }}>
            <span>Discount:</span>
            <span><strong>- ₹{discount}</strong></span>
          </div>
        )}
        {gst > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: "#3b82f6" }}>
            <span>GST ({gst}%):</span>
            <span><strong>+ ₹{gstAmount.toFixed(2)}</strong></span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #e5e7eb" }}>
          <span><strong>Grand Total:</strong></span>
          <span><strong>₹{grandTotal.toFixed(2)}</strong></span>
        </div>
        
        {paymentMethod && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
            <span>Payment Method:</span>
            <span><strong>{paymentMethod}</strong></span>
          </div>
        )}
      </div>
      
      <div className="no-print summary-buttons" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "20px" }}>
        <button 
          onClick={saveBill} 
          className="btn-primary" 
          disabled={cart.length === 0}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
        >
          <MdSave size={18} /> Save
        </button>
        <button 
          onClick={handlePrint} 
          className="btn-success" 
          disabled={cart.length === 0 || !isSaved}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
          title={!isSaved ? "Save bill before printing" : "Print bill"}
        >
          <MdPrint size={18} /> Print
        </button>
        <button 
          onClick={newBill} 
          className="btn-warning"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
        >
          <MdRefresh size={18} /> New
        </button>
      </div>
    </div>
  );
}

export default Summary;