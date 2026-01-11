import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity } from '../redux/cartSlice'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 w-full">
        <section className="pt-6 md:pt-8 pb-12 px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm text-center mb-6">
            Shopping Cart
          </h1>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-10 md:p-12 border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-3xl mb-5">
                  🛒
                </div>
                <p className="text-2xl font-extrabold text-gray-900">Your cart is empty</p>
                <p className="text-gray-600 mt-2 max-w-md">
                  Looks like you haven’t added anything yet. Explore our categories and find something you’ll love.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link
                    to="/"
                    className="inline-block bg-[#4169e1] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#315ac1] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full">
      <section className="pt-6 md:pt-8 pb-12 px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm text-center mb-6">
          Shopping Cart
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black">{item.name}</h3>
                      <p className="text-[#4169e1] font-bold">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) || 1 }))}
                          className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                        />
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col justify-between">
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 font-semibold hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                      <p className="font-bold text-[#4169e1]">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 mb-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#4169e1]">₹{(getTotalPrice() * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!cartItems || cartItems.length === 0) {
                      alert('Your cart is empty')
                      return
                    }
                    navigate('/ordersummary')
                  }}
                  disabled={!cartItems || cartItems.length === 0}
                  className="w-full bg-[#4169e1] text-white font-semibold py-3 rounded-lg hover:bg-[#315ac1] transition-colors mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Checkout
                </button>

                <Link to="/" className="block text-center text-[#4169e1] font-semibold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Cart

