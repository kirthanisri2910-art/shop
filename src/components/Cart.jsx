import { useMemo } from "react";
import { MdDelete, MdShoppingCart } from "react-icons/md";

function Cart({ cart, removeItem, updateQuantity }) {
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);


  const grandTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  }, [cart]);


  return (
    <>
      <div className="flex justify-between mb-3 text-xs text-slate-400 uppercase tracking-wide font-semibold">
        <span>{cart.length} product{cart.length !== 1 ? 's' : ''}</span>
        <span>{totalItems} units</span>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Product</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Price</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Qty</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Total</th>
            <th className="px-3 py-2.5 print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={`${item.id}-${index}`} className="hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
              <td className="px-3 py-3 text-slate-400 text-xs">{index + 1}</td>
              <td className="px-3 py-3 text-slate-800 font-medium text-sm">{item.name}</td>
              <td className="px-3 py-3 text-slate-500 text-sm">₹{item.price}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-1 print:hidden">
                  <button
                    onClick={() => item.quantity > 1 && updateQuantity(item, item.quantity - 1)}
                    className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 flex items-center justify-center text-sm transition"
                  >−</button>
                  <input
                    type="number" value={item.quantity} min={1}
                    onChange={e => { const v = Number(e.target.value); if (v >= 1) updateQuantity(item, v); }}
                    className="w-10 text-center border border-slate-200 rounded p-1 text-xs font-semibold focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 flex items-center justify-center text-sm transition"
                  >+</button>
                </div>
                <span className="hidden print:block text-sm font-semibold">{item.quantity}</span>
              </td>
              <td className="px-3 py-3 text-slate-800 font-semibold text-sm">₹{item.total}</td>
              <td className="px-3 py-3 print:hidden">
                <button onClick={() => removeItem(item)} title="Remove"
                  className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Cart;
