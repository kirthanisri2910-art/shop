import { useState, useRef, useEffect,useMemo } from "react";
import { MdWarning, MdInventory } from "react-icons/md";

function ProductSelector({ products, addToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const quantityRef = useRef(null);
  const searchRef = useRef(null);

  const filteredProducts = useMemo(()=>{
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

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
   
    const qty = Number(quantity);
    if (!qty || qty <= 0) return;

    addToCart(selectedProduct, qty);
    
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
      <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
        <MdInventory size={14} /> Select Product
      </label>

      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); setSelectedProduct(null); }}
          onFocus={() => setShowDropdown(true)}
          className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700 text-sm"
        />

        {showDropdown && searchTerm && filteredProducts.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 max-h-64 overflow-y-auto z-10 shadow-lg">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p)}
                className="px-4 py-2.5 cursor-pointer border-b border-slate-100 last:border-0 hover:bg-indigo-50 transition"
              >
                <div className="text-sm font-medium text-slate-700">{p.name}</div>
                <div className="text-xs text-slate-400">₹{p.sellingPrice}/{p.unit} &middot; Stock: {p.stock}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2.5">
        <input
          ref={quantityRef}
          type="number" step="0.01" placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <button onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition">
          Add
        </button>
      </div>

      {selectedProduct && selectedProduct.stock < 5 && (
        <p className="text-amber-500 text-xs mt-2 flex items-center gap-1">
          <MdWarning size={14} /> Only {selectedProduct.stock} {selectedProduct.unit} left
        </p>
      )}
    </div>
  );
}

export default ProductSelector;