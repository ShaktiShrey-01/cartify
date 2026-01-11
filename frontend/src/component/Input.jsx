import React from 'react'
import { useId } from 'react'

const Input = React.forwardRef(function
    Input({ label, type = 'text', placeholder, error, className = '', ...props }, ref) {
  const id = useId();
  return (
    <div className='w-full flex flex-col gap-2'>
      {label && (
        <label htmlFor={id} className='text-sm font-semibold text-gray-700'>{label}</label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`px-4 py-3 rounded-lg border ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-[#4169e1]'
        } focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
})

export default Input
