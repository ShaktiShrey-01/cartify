import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE, unwrapApiResponse } from "../utils/api.js";

const SearchBar = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef();
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Load products once when the search opens, then filter locally from backend.
  // This avoids inconsistent JSON Server full-text `?q=` results and ensures up-to-date backend data.
  useEffect(() => {
    if (!isOpen || productsLoaded) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/products/getallproducts`, { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        const data = unwrapApiResponse(json);
        if (cancelled) return;
        setAllProducts(Array.isArray(data) ? data : []);
        setProductsLoaded(true);
      } catch (err) {
        if (!cancelled) console.error('Failed to load products for search:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, productsLoaded]);

  /**
   * Filter products by search query.
   * Matches only when the product name STARTS WITH the query (case-insensitive).
   * This prevents unrelated results (e.g., matching by type/id) when typing a single letter.
   *
   * @returns {Array} Filtered product results (max 25)
   */
  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!isOpen) return [];
    if (query.length < 1) return [];

    // Helper to normalize string values
    const normalize = (value) => String(value ?? '').toLowerCase();

    // Match only product names that start with the query
    const results = allProducts.filter((product) => {
      const name = normalize(product?.name);
      return name.startsWith(query);
    });

    return results.slice(0, 25);
  }, [searchQuery, allProducts, isOpen]);

  useEffect(() => {
    setSearchResults(filteredResults);
  }, [filteredResults]);

  /**
   * Handle search input changes.
   * Updates the search query state.
   */
  // Debounced search input handler
  const handleSearch = (e) => {
    const query = e.target.value;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(query);
    }, 300); // 300ms debounce
  };

  /**
   * Close the search dialog and reset all search state.
   */
  const closeSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setAllProducts([]);
    setProductsLoaded(false);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    onClose();
  };

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.querySelector('#search-input');
        if (input) input.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {/* Search Results Dialog */}
      <div
        className={`fixed inset-0 z-55 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Blurrish Background Overlay (Same as Hamburger Menu) */}
        <div
          className="absolute inset-0 bg-black/25 backdrop-blur-md"
          onClick={closeSearch}
        />

        {/* Search Bar Above Results */}
        <div
          className={`absolute top-25 left-1/2 -translate-x-1/2 w-[92vw] max-w-150 
                     transition-all duration-300 z-10
                     ${isOpen ? "translate-y-0" : "-translate-y-10"}`}
        >
          <div className="relative flex items-center mb-4">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full h-12 pl-12 pr-12 rounded-full bg-white/90 border border-[#4169e1]/55 
                       focus:outline-none focus:ring-2 focus:ring-[#4169e1]/50 
                       placeholder:text-gray-500 text-black
                       transition-all duration-200 shadow-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              onClick={closeSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div
          className={`absolute top-41.25 left-1/2 -translate-x-1/2 w-[92vw] max-w-150 
                     bg-white/85 text-black border border-black/10 rounded-4xl 
                     shadow-2xl transition-all duration-300 max-h-[70vh] overflow-hidden
                     ${isOpen ? "translate-y-0 scale-100" : "-translate-y-10 scale-95"}`}
        >
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between relative">
            <h3 className="text-lg font-semibold text-[#4169e1]">
              Search Results ({searchResults.length})
            </h3>
            <button
              onClick={closeSearch}
              className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer absolute right-6 top-1/2 -translate-y-1/2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-4">
            {searchResults.length > 0 ? (
              <ul className="space-y-3">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={closeSearch}
                  >
                    <li
                      className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl 
                               border border-black/5 hover:bg-white/80 
                               hover:border-[#4169e1]/30 transition-all duration-200 cursor-pointer
                               hover:scale-[1.02] transform"
                    >
                      <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-xl 
                                    flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            fetchpriority="low"
                          />
                        ) : null}
                      </div>
                      <div className="grow">
                        <h4 className="font-semibold text-black">{product.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                        {product.rating !== undefined &&
                        product.rating !== null &&
                        String(product.rating).trim() !== '' ? (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-sm">★</span>
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="shrink-0 font-bold text-[#4169e1]">
                        ₹{product.price}
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">No products found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
