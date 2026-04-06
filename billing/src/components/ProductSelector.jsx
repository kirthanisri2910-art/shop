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
      <label className="block mb-2 text-sm font-semibold text-gray-700 flex items-center gap-1">
        <MdInventory size={18} /> Select Product
      </label>
      
      <div className="relative">
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
          className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        
        {showDropdown && searchTerm && filteredProducts.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border-2 border-blue-500 rounded-lg mt-1 max-h-72 overflow-y-auto z-10 shadow-lg">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p)}
                className="p-3 cursor-pointer border-b border-gray-100 hover:bg-blue-500 hover:text-white transition"
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs opacity-75">
                  ₹{p.price}/{p.unit}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2.5 mt-2.5">
        <input
          ref={quantityRef}
          type="number"
          step="0.01"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="flex-1 p-3 my-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 my-2 rounded-lg font-semibold transition">
          Add 
        </button>
      </div>
      
      {selectedProduct && selectedProduct.stock < 5 && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <MdWarning size={16} /> Only {selectedProduct.stock} {selectedProduct.unit} left in stock!
        </p>
      )}
    </div>
  );
}

export default ProductSelector;