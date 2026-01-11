import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/cartSlice'

const CartBtn = ({ product, className = "" }) => {
  const [isClicked, setIsClicked] = useState(false)
  const dispatch = useDispatch()
  const productId = product?.id ?? product?._id
  const isInCart = useSelector((state) =>
    state.cart.items.some((item) => (item.id ?? item._id) === productId)
  )

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsClicked(true)
    dispatch(addToCart(product))
    
    // Reset after animation completes, keep "Added" visible briefly
    setTimeout(() => {
      setIsClicked(false)
    }, 2400)
  }

  return (
    <button
      onClick={handleClick}
      className={`cart-button ${isClicked ? 'clicked' : ''} ${isInCart ? 'in-cart' : ''} ${className}`}
    >
      <span className="add-to-cart">Add to cart</span>
      <span className="added">Added</span>
      <i className="fa-shopping-cart">🛒</i>
      <i className="fa-box">📦</i>

      <style jsx>{`
        .cart-button {
          position: relative;
          padding: 10px 12px;
          width: 100%;
          height: 46px;
          border: 2px solid #4169e1;
          border-radius: 999px;
          background: #4169e1;
          outline: none;
          cursor: pointer;
          color: #111;
          transition: transform 0.2s ease-in-out, background-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
          overflow: hidden;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
          -webkit-tap-highlight-color: transparent;
        }

        /* Glass reflection effect */
        .cart-button::before {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.0) 35%,
            rgba(255, 255, 255, 0.55) 45%,
            rgba(255, 255, 255, 0.0) 55%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-140%);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        .cart-button:hover {
          background: #315ac1;
          box-shadow: 0 14px 26px rgba(0, 0, 0, 0.12);
          transform: translateY(-1px);
        }

        .cart-button:hover::before {
          opacity: 1;
          animation: cartShine 700ms ease-out 1;
        }

        .cart-button:active {
          transform: scale(.98);
        }

        .cart-button .fa-shopping-cart {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: -10%;
          font-size: 1.8em;
          transform: translate(-50%, -50%);
        }

        .cart-button .fa-box {
          position: absolute;
          z-index: 3;
          top: -20%;
          left: 52%;
          font-size: 1.2em;
          transform: translate(-50%, -50%);
        }

        .cart-button span {
          position: absolute;
          z-index: 3;
          left: 50%;
          top: 50%;
          font-size: 0.98rem;
          color: #000;
          font-weight: 600;
          letter-spacing: 0.2px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
        }

        @media (max-width: 420px) {
          .cart-button {
            height: 42px;
            padding: 8px 10px;
          }

          .cart-button span {
            font-size: 0.92rem;
          }

          .cart-button .fa-shopping-cart {
            font-size: 1.6em;
          }

          .cart-button .fa-box {
            font-size: 1.1em;
          }
        }

        /* Featured cards: larger button on mobile for better touch targets */
        @media (max-width: 420px) {
          .cart-button.cart-button--featured {
            height: 46px;
            padding: 10px 14px;
          }

          .cart-button.cart-button--featured span {
            font-size: 1rem;
          }
        }

        .cart-button span.add-to-cart { opacity: 1; }
        .cart-button span.added { opacity: 0; }

        /* Persist label when item is in cart */
        .cart-button.in-cart span.add-to-cart { opacity: 0; }
        .cart-button.in-cart span.added { opacity: 1; }

        .cart-button.clicked .fa-shopping-cart {
          animation: cart 1.5s ease-in-out forwards;
        }

        .cart-button.clicked .fa-box {
          animation: box 1.5s ease-in-out forwards;
        }

        .cart-button.clicked span.add-to-cart {
          animation: txt1 1.5s ease-in-out forwards;
        }

        .cart-button.clicked span.added {
          animation: txt2 1.5s ease-in-out forwards;
        }

        @keyframes cart {
          0% {
            left: -10%;
          }
          40%, 60% {
            left: 50%;
          }
          100% {
            left: 110%;
          }
        }

        @keyframes box {
          0%, 40% {
            top: -20%;
          }
          60% {
            top: 40%;
            left: 52%;
          }
          100% {
            top: 40%;
            left: 112%;
          }
        }

        @keyframes txt1 {
          0% {
            opacity: 1;
          }
          20%, 100% {
            opacity: 0;
          }
        }

        @keyframes txt2 {
          0%, 80% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes cartShine {
          0% {
            transform: translateX(-140%);
          }
          100% {
            transform: translateX(140%);
          }
        }
      `}</style>
    </button>
  )
}

export default CartBtn
