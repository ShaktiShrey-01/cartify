import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Review, Loader, CartBtn } from '../index.js';
import Buybtn from '../component/Buybtn';
import { API_BASE, unwrapApiResponse } from '../utils/api.js';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewRef = useRef(null);

  const averageRating = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0);
    const avg = sum / reviews.length;
    return Number.isFinite(avg) ? Number(avg.toFixed(1)) : null;
  }, [reviews]);

  // Fetch reviews for this product from backend
  const fetchReviews = async () => {
    try {
      const reviewsRes = await fetch(`${API_BASE}/api/v1/reviews?productId=${id}`);
      if (!reviewsRes.ok) return;
      const json = await reviewsRes.json();
      const reviewsData = unwrapApiResponse(json);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product by id from backend
        const productRes = await fetch(`${API_BASE}/api/v1/products/getproductbyid/${id}`);
        if (!productRes.ok) throw new Error(`Failed to load product: ${productRes.status}`);
        const json = await productRes.json();
        const foundProduct = unwrapApiResponse(json);
        if (!foundProduct) throw new Error('Product not found');
        setProduct(foundProduct);

        await fetchReviews();
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProductAndReviews();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [...prev, newReview]);
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews((prev) => prev.map((r) => (String(r.id) === String(updatedReview.id) ? updatedReview : r)))
  }

  const handleReviewDeleted = (deletedId) => {
    setReviews((prev) => prev.filter((r) => String(r.id) !== String(deletedId)))
  }

  // Page-level skeleton while fetching product + reviews
  if (loading) {
    return (
      <div className="flex-1 w-full min-h-screen pt-24 pb-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <Loader type="card" count={8} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 w-full pt-24 pb-12 px-6 md:px-10">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">{error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex-1 w-full pt-24 pb-12 px-6 md:px-10">
        <div className="text-center">Product not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full">
      <section className="pt-8 md:pt-12 pb-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-xl min-h-[22rem] md:min-h-[28rem] lg:min-h-[32rem]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-2 md:mb-3">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {averageRating !== null ? (
                      <>
                        <span className="text-xl md:text-2xl text-yellow-400">★</span>
                        <span className="text-base md:text-lg font-semibold text-gray-700">{averageRating}</span>
                        <span className="text-sm text-gray-500">({reviews.length})</span>
                      </>
                    ) : product.rating !== undefined &&
                      product.rating !== null &&
                      String(product.rating).trim() !== '' ? (
                      <>
                        <span className="text-xl md:text-2xl text-yellow-400">★</span>
                        <span className="text-base md:text-lg font-semibold text-gray-700">
                          {product.rating}
                        </span>
                      </>
                    ) : (
                      <span className="text-base md:text-lg text-gray-500 italic">No rating</span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-gray-600">
                    Category: <span className="font-semibold capitalize">{product.category}</span>
                  </p>
                </div>

                {/* Description Box */}
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border border-gray-200">
                  <h3 className="text-base md:text-lg font-bold text-black mb-3">Product Description</h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {product.description && String(product.description).trim().length > 0
                      ? product.description
                      : `High-quality ${product.category} product with excellent features and durability. This premium product is designed to meet your needs with superior craftsmanship and attention to detail. Perfect for everyday use with long-lasting performance and reliability.`}
                  </p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-gray-200 py-4 md:py-6">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#4169e1]">
                    ₹{product.price}
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">Inclusive of all taxes</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
                    <p className="text-xs md:text-sm font-semibold text-[#4169e1]">✓ Premium Quality</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
                    <p className="text-xs md:text-sm font-semibold text-green-600">✓ Fast Shipping</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
                    <p className="text-xs md:text-sm font-semibold text-purple-600">✓ Easy Returns</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 md:p-4 border border-orange-200">
                    <p className="text-xs md:text-sm font-semibold text-orange-600">✓ 1 Year Warranty</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8">
                <CartBtn product={product} />
                <Buybtn label="Buy Now" onClick={() => navigate('/ordersummary', { state: { product } })} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <Review
        ref={reviewRef}
        reviews={reviews}
        loading={loading}
        productId={id}
        onReviewAdded={handleReviewAdded}
        onReviewUpdated={handleReviewUpdated}
        onReviewDeleted={handleReviewDeleted}
        API_BASE={API_BASE}
      />
    </div>
  )
}

export default ProductDetail
