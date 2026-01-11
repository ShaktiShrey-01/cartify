import { useEffect, useState } from 'react';
import { Card, Loader } from "../index.js";
import { API_BASE, unwrapApiResponse } from "../utils/api.js";

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch only featured products from backend
        const res = await fetch(`${API_BASE}/api/v1/products/getallproducts?featured=true`);
        if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
        const json = await res.json();
        const products = unwrapApiResponse(json);
        // Shuffle and pick up to 5 featured products
        const shuffled = Array.isArray(products) ? [...products].sort(() => Math.random() - 0.5) : [];
        const picked = shuffled.slice(0, 5);
        setFeaturedProducts(picked);
      } catch (err) {
        console.error(err);
        setError("Could not load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-full px-6 md:px-10 pt-2 md:pt-3 pb-2 md:pb-3">
      <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm text-center -mt-12 md:-mt-10 mb-2 md:mb-0 px-2">
        Featured
      </h2>

      <div className="overflow-x-auto overflow-y-hidden pb-6 md:pb-8 scrollbar-hide max-w-[90rem] mx-auto mt-8 md:mt-10">
        {loading ? (
          <Loader type="card" count={5} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-2">Unable to load featured products</p>
            <p className="text-sm text-gray-500">Please check your connection and try again later</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No featured products available</p>
          </div>
        ) : (
          <div className="flex gap-7 md:gap-8 px-2 min-w-max mt-6 md:mt-10">
            {featuredProducts.map((product) => (
              <div
                key={product.id ?? product.name}
                className="w-[14rem] md:w-[16rem] transform transition-transform duration-[1400ms] ease-in-out hover:scale-[1.05] md:hover:scale-[1.03]"
              >
                <Card product={product} cartBtnClassName="cart-button--featured" size="featured" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
