import React, { useEffect, useState } from 'react';
import { Card, Loader, SortNav } from "../index.js";
import { API_BASE, unwrapApiResponse } from "../utils/api.js";

const Clothing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch only clothing products from backend
        const res = await fetch(`${API_BASE}/api/v1/products/getallproducts?categoryKey=clothing`);
        if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
        const json = await res.json();
        const clothingProducts = unwrapApiResponse(json);
        setProducts(Array.isArray(clothingProducts) ? clothingProducts : []);
      } catch (err) {
        console.error(err);
        setError('Could not load clothing products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get filtered and sorted products from SortNav
  const sortNav = SortNav({ products, sortBy, setSortBy, selectedType, setSelectedType });
  const filteredProducts = sortNav.filteredProducts;
  // const types = sortNav.types;

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="w-full">
      {/* Sort Nav Component - Always Below Main Navbar */}
      <div className="w-full px-6 md:px-10 py-3 md:py-4 bg-gray-50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          {sortNav.ui}
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <Loader type="card" count={8} />
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id}>
                      <Card product={product} showBuyNow />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-lg py-12">
                  No products match your filters
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Clothing
