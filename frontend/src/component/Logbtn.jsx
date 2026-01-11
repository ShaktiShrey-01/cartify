import React from 'react'

// Simple, unique green login button with a subtle shimmer and arrow slide
const Logbtn = ({ children = 'Login', className = '', onClick }) => {
  return (
    <button
      type="button"
      className={`loginButton ${className}`}
      onClick={onClick}
    >
      <span className="btnText">{children}</span>
      <svg className="btnArrow" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
      </svg>

      <style jsx>{`
        .loginButton {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          min-width: 116px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid #166534;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: .2px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          box-shadow: 0 8px 18px rgba(22, 163, 74, 0.28);
          transition: box-shadow 180ms ease, transform 80ms ease;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }

        .loginButton::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
          transform: translateX(-100%);
          pointer-events: none;
        }

        .loginButton:hover { box-shadow: 0 12px 24px rgba(22, 163, 74, 0.38); cursor: pointer; }
        .loginButton:hover::before { animation: shine 1.4s ease-in-out forwards; }
        .loginButton:active { transform: scale(.98); }

        .btnText { position: relative; z-index: 1; }
        .btnArrow { width: 18px; height: 18px; color: #ffffff; position: relative; z-index: 1; }
        .loginButton:hover .btnArrow { animation: arrowSlide 900ms ease both; }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes arrowSlide {
          0% { transform: translateX(0) scale(1); }
          35% { transform: translateX(6px) scale(1.06); }
          65% { transform: translateX(3px) scale(1.02); }
          85% { transform: translateX(7px) scale(1.06); }
          100% { transform: translateX(5px) scale(1.04); }
        }
      `}</style>
    </button>
  )
}

export default Logbtn
