import React from 'react'
import { useId } from 'react'

const Input = React.forwardRef(function
    Input({ label, type = 'text', placeholder, error, className = '', ...props }, ref) {
  const id = useId();
  const [show, setShow] = React.useState(false);
  const isPassword = String(type).toLowerCase() === 'password';
  const resolvedType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className='w-full flex flex-col gap-2'>
      {label && (
        <label htmlFor={id} className='text-sm font-semibold text-gray-700'>{label}</label>
      )}
      <div className={isPassword ? 'relative' : undefined}>
        <input
          id={id}
          ref={ref}
          type={resolvedType}
          placeholder={placeholder}
          className={`px-4 py-3 rounded-lg border ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-[#4169e1]'
          } focus:outline-none focus:ring-2 transition-all duration-200 ${isPassword ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
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
