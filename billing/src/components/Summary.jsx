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
    <div className="mt-5 pt-4 border-t-2 border-gray-200">
      <div className="text-base mb-2">
        <div className="flex justify-between mb-1">
          <span>Subtotal:</span>
          <span><strong>₹{subtotal}</strong></span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between mb-1 text-green-500">
            <span>Discount:</span>
            <span><strong>- ₹{discount}</strong></span>
          </div>
        )}
        {gst > 0 && (
          <div className="flex justify-between mb-1 text-blue-500">
            <span>GST ({gst}%):</span>
            <span><strong>+ ₹{gstAmount.toFixed(2)}</strong></span>
          </div>
        )}
        <div className="flex justify-between text-lg mt-2.5 pt-2.5 border-t border-gray-200">
          <span><strong>Grand Total:</strong></span>
          <span><strong>₹{grandTotal.toFixed(2)}</strong></span>
        </div>
        
        {paymentMethod && (
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Payment Method:</span>
            <span><strong>{paymentMethod}</strong></span>
          </div>
        )}
      </div>
      
      <div className="print:hidden grid grid-cols-3 gap-2.5 mt-5">
        <button 
          onClick={saveBill} 
          disabled={cart.length === 0}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-1"
        >
          <MdSave size={18} /> Save
        </button>
        <button 
          onClick={handlePrint} 
          disabled={cart.length === 0 || !isSaved}
          title={!isSaved ? "Save bill before printing" : "Print bill"}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-1"
        >
          <MdPrint size={18} /> Print
        </button>
        <button 
          onClick={newBill} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-1"
        >
          <MdRefresh size={18} /> New
        </button>
      </div>
    </div>
  );
}

export default Summary;