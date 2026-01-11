import React from 'react'
import logo from '../assets/Cart.png'

// Shared auth page layout (Login/Signup)
// - Keeps the brand column + card sizing consistent
// - Hosts the small CSS animations used for success/error transitions
const AuthLayout = ({ formAnimation = '', children }) => {
  return (
    <div className="min-h-screen flex items-center md:items-start justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-12 md:pt-4">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
      `}</style>

      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-start justify-center md:gap-16">
          <div className="flex flex-col items-center md:items-start mb-10 md:mb-0 md:mt-4">
            {logo ? (
              <img src={logo} alt="Cartify" className="w-20 h-20 md:w-32 md:h-32 mb-2" />
            ) : null}
            <h2 className="text-4xl md:text-6xl font-extrabold text-black">Cartify</h2>
            <p className="text-gray-600 mt-1 text-center md:text-left">
              Your ultimate shopping destination
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl shadow-2xl p-8 md:p-8 transition-all duration-300 w-full md:max-w-md ${
              formAnimation === 'error' ? 'animate-shake' : ''
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
