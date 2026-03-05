import { MdDelete, MdShoppingCart } from "react-icons/md";

function Cart({ cart, removeItem }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", color: "#6b7280" }}>
        <span>Total Items: <strong>{totalItems}</strong></span>
        <span>Products: <strong>{cart.length}</strong></span>
      </div>
      
      {cart.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 40px', 
          background: '#f9fafb', 
          borderRadius: '12px',
          color: '#9ca3af'
        }}>
          <MdShoppingCart size={64} style={{ opacity: 0.3, marginBottom: '15px' }} />
          <p style={{ fontSize: '18px', fontWeight: '600', margin: '10px 0', color: '#6b7280' }}>Cart is empty</p>
          <p style={{ fontSize: '14px', margin: 0 }}>Add products to start billing</p>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>₹{item.price}</td>
                  <td><strong>{item.quantity}</strong></td>
                  <td><strong>₹{item.total}</strong></td>
                  <td className="no-print">
                    <button 
                      onClick={() => removeItem(item)} 
                      style={{ 
                        padding: "8px 14px", 
                        fontSize: "12px",
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: '600'
                      }}
                    >
                      <MdDelete size={16} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                <td colSpan="4" style={{ textAlign: 'right' }}>Grand Total:</td>
                <td colSpan="2">₹{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default Cart;