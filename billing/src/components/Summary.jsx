import { useMemo } from "react";
import { MdSave, MdPrint, MdRefresh } from "react-icons/md";

function Summary({ cart, discount = 0, paymentMethod, newBill, saveBill, gst = 0, isSaved = false, isPrinted = false, onPrintComplete }) {
   const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  }, [cart]);

  
  const totalAfterDiscount = Math.max(0, subtotal - discount);
   const gstAmount = useMemo(() => {
    return Math.round(((totalAfterDiscount * gst) / 100) * 100) / 100;
  }, [totalAfterDiscount, gst]);
  const grandTotal = totalAfterDiscount + gstAmount;

  const handlePrint = () => {
    if (cart.length === 0 || !isSaved) return;
    window.print();
    onPrintComplete?.();
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-slate-700">₹{subtotal}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Discount</span>
            <span className="text-emerald-600">- ₹{discount}</span>
          </div>
        )}
        {gst > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">GST ({gst}%)</span>
            <span className="text-slate-600">+ ₹{gstAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <span className="text-slate-700 font-semibold">Grand Total</span>
          <span className="text-slate-900 text-2xl font-bold">₹{grandTotal.toFixed(2)}</span>
        </div>
        {paymentMethod && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Payment</span>
            <span className="text-slate-600 font-medium">{paymentMethod}</span>
          </div>
        )}
      </div>

      <div className="print:hidden grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={saveBill}
          disabled={cart.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1.5"
        >
          <MdSave size={16} /> Save
        </button>
        <button
          onClick={handlePrint}
          disabled={cart.length === 0 || !isSaved}
          title={!isSaved ? "Save bill before printing" : "Print bill"}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1.5"
        >
          <MdPrint size={16} /> Print
        </button>
        <button
          onClick={newBill}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1.5"
        >
          <MdRefresh size={16} /> New
        </button>
      </div>
    </div>
  );
}

export default Summary;