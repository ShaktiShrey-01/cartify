
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
                        // Eye-off icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0021.9 12c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.364-.964M3 3l18 18" />
                        </svg>
                    ) : (
                        // Eye icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0021.9 12c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.364-.964" />
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
