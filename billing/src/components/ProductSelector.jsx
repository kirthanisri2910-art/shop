import { useState, useRef, useEffect } from "react";
import { MdWarning, MdInventory } from "react-icons/md";

function ProductSelector({ products, addToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const quantityRef = useRef(null);
  const searchRef = useRef(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && selectedProduct && quantity) {
        handleAdd();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedProduct, quantity]);

  const handleAdd = () => {
    if (!selectedProduct) return;
    if (!quantity || quantity <= 0) return;
    addToCart(selectedProduct, Number(quantity));
    
    setSelectedProduct(null);
    setQuantity("");
    setSearchTerm("");
    searchRef.current?.focus();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setShowDropdown(false);
    quantityRef.current?.focus();
  };

  return (
    <div>
      <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151", display: "flex", alignItems: "center", gap: "5px" }}>
        <MdInventory size={18} /> Select Product
      </label>
      
      <div style={{ position: 'relative' }}>
        <input
          ref={searchRef}
          type="text"
          placeholder="Type to search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
            setSelectedProduct(null);
          }}
          onFocus={() => setShowDropdown(true)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        
        {showDropdown && searchTerm && filteredProducts.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginTop: '5px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  background: 'white'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                <div style={{ fontWeight: '600' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  ₹{p.price}/{p.unit}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          ref={quantityRef}
          type="number"
          step="0.01"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={handleAdd} className="btn-success">
          Add 
        </button>
      </div>
      
      {selectedProduct && selectedProduct.stock < 5 && (
        <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
          <MdWarning size={16} /> Only {selectedProduct.stock} {selectedProduct.unit} left in stock!
        </p>
      )}
    </div>
  );
}

export default ProductSelector;