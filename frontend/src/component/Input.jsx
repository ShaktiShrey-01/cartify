import React from 'react'
import { useId } from 'react'

const Input = React.forwardRef(function
    Input({ label, type = 'text', placeholder, error, className = '', ...props }, ref) {
const id=useId();
    const [show, setShow] = React.useState(false);
    const isPassword = String(type).toLowerCase() === 'password';
    return (
        <div className='w-full flex flex-col gap-2'>
            {label && (
                <label htmlFor={id} className='text-sm font-semibold text-gray-700'>{label}</label>
            )}
            <div className={isPassword ? 'relative' : undefined}>
              <input
                  id={id}
                  ref={ref}
                  type={isPassword ? (show ? 'text' : 'password') : type}
                  placeholder={placeholder}
                  className={`px-4 py-3 rounded-lg border ${
                    error 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#4169e1]'
                  } focus:outline-none focus:ring-2 transition-all duration-200 ${isPassword ? 'pr-12' : ''} ${className}`}
                  {...props}
              />
              {isPassword ? (
                <button
                  type="button"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              ) : null}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    )
})

export default Input
