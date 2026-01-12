
import React, { useId, useState } from 'react'


const Input = React.forwardRef(function Input({ label, type = 'text', placeholder, error, className = '', ...props }, ref) {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className='w-full flex flex-col gap-2 relative'>
            {label && (
                <label htmlFor={id} className='text-sm font-semibold text-gray-700'>{label}</label>
            )}
            <input
                id={id}
                ref={ref}
                type={isPassword && showPassword ? 'text' : type}
                placeholder={placeholder}
                className={`px-4 py-3 rounded-lg border ${
                    error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#4169e1]'
                } focus:outline-none focus:ring-2 transition-all duration-200 ${className} ${isPassword ? 'pr-10' : ''}`}
                {...props}
            />
            {/* Show/hide password icon */}
            {isPassword && (
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    {showPassword ? (
                        // Eye-off icon (closed eye)
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.273 7.24 19.5 12 19.5c1.772 0 3.437-.374 4.899-1.04m3.121-2.14A10.45 10.45 0 0022.066 12c-1.292-4.273-5.306-7.5-10.066-7.5-1.257 0-2.462.184-3.588.523M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364l12-12" />
                        </svg>
                    ) : (
                        // Eye icon (open eye)
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-1.25.25-2.45.7-3.54C4.77 5.23 8.13 2.25 12 2.25s7.23 2.98 9.05 6.21c.45 1.09.7 2.29.7 3.54s-.25 2.45-.7 3.54C19.23 18.77 15.87 21.75 12 21.75s-7.23-2.98-9.05-6.21A10.45 10.45 0 012.25 12zm9.75 0a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            )}
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
});

export default Input
