import React from 'react'

const CheckIcon = () => (
  <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XMarkIcon = () => (
  <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  status = null,
  className = "",
  ...props
}) => {
  const variants = {
    primary: 'bg-[#4169e1] hover:bg-[#315ac1] text-black-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'bg-transparent border-2 border-[#4169e1] text-[#4169e1] hover:bg-[#4169e1] hover:text-white',
  }

  const getStatusStyles = () => {
    if (status === 'success') return 'bg-green-500 text-white'
    if (status === 'error') return 'bg-red-500 text-white'
    return variants[variant]
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-500 cursor-pointer
        ${getStatusStyles()} 
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}
        ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : status === 'success' ? (
        <span className="flex items-center justify-center gap-2">
          <CheckIcon />
          Success
        </span>
      ) : status === 'error' ? (
        <span className="flex items-center justify-center gap-2">
          <XMarkIcon />
          Failed
        </span>
      ) : children}
    </button>
  )
}

export default Button
