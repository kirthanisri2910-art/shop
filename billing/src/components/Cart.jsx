import { MdDelete, MdShoppingCart } from "react-icons/md";

function Cart({ cart, removeItem }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  
  return (
    <>
      <div className="flex justify-between mb-2.5 text-sm text-gray-500">
        <span>Total Items: <strong>{totalItems}</strong></span>
        <span>Products: <strong>{cart.length}</strong></span>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16 px-10 bg-gray-50 rounded-xl text-gray-400">
          <MdShoppingCart size={64} className="opacity-30 mb-4 mx-auto" />
          <p className="text-lg font-semibold my-2.5 text-gray-500">Cart is empty</p>
          <p className="text-sm m-0">Add products to start billing</p>
        </div>
      ) : (
        <>
          <table className="w-full border-collapse my-4 bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">S.No</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Product</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Price</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Qty</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Total</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide print:hidden">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">{index + 1}</td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">₹{item.price}</td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800"><strong>{item.quantity}</strong></td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800"><strong>₹{item.total}</strong></td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800 print:hidden">
                    <button 
                      onClick={() => removeItem(item)} 
                      className="px-3.5 py-2 text-xs bg-red-500 hover:bg-red-600 text-white border-none rounded-md cursor-pointer flex items-center gap-1 font-semibold transition"
                    >
                      <MdDelete size={16} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="4" className="text-right p-3.5">Grand Total:</td>
                <td colSpan="2" className="p-3.5">₹{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default Cart;