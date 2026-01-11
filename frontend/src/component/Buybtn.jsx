import React from 'react'
import './Buybtn.css'

const Buybtn = ({ label = 'Buy Now', onClick, className = '', disabled = false, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`super-button w-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{label}</span>
      <svg fill="none" viewBox="0 0 24 24" className="arrow" aria-hidden="true">
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          d="M5 12h14M13 6l6 6-6 6"
        ></path>
      </svg>
    </button>
  )
}

export default Buybtn
