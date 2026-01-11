import { Link, useNavigate } from 'react-router-dom';
import CartBtn from './CartBtn';
import Buybtn from './Buybtn';

const Card = ({ product, showBuyNow = false, cartBtnClassName = '', size = 'default' }) => {
  const { id, name, price, rating, image, category } = product;
  const hasRating = rating !== undefined && rating !== null && String(rating).trim() !== '';
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/ordersummary', { state: { product } });
  };

  return (
    <Link to={`/product/${id}`} className="block">
      <div className="group shrink-0 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 h-full">
        {/* Image Container */}
        <div className={`relative w-full ${size === 'featured' ? 'h-44 md:h-48' : 'h-45 md:h-55'} bg-gray-100 flex items-center justify-center`}>
          {image ? (
            <img
              src={image}
              alt={name}
              className="max-w-full max-h-full object-contain"
              loading="eager"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          {/* Product Name */}
          <h3 className="text-base md:text-lg font-semibold text-black tracking-tight truncate transition-colors duration-300">
            {name}
          </h3>

          {/* Rating (only show when present) */}
          {hasRating ? (
            <div className="flex items-center gap-1 mt-2 mb-3">
              <span className="text-yellow-400">★</span>
              <span className="text-xs md:text-sm text-gray-700 font-medium">{rating}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-2 mb-3">
              <span className="text-gray-300">★</span>
              <span className="text-xs md:text-sm text-gray-500 font-medium">No rating</span>
            </div>
          )}

          {/* Price */}
          <p className="text-lg md:text-xl font-bold text-[#4169e1] mb-4">₹{price}</p>

          {/* Add to Cart Button */}
          <CartBtn product={product} className={cartBtnClassName} />

          {showBuyNow ? (
            <div className="mt-3">
              <Buybtn label="Buy Now" onClick={handleBuyNow} />
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default Card;
