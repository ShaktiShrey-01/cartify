import React, { useEffect, useMemo, useRef, useState } from 'react'

// Animated logout button adapted from provided SVG/CSS/JS
// Click runs the animation sequence, then calls onClick()
const LogoutBtn = ({ onClick, className = "" }) => {
  const [state, setState] = useState('default')
  const [clicked, setClicked] = useState(false)
  const [doorSlammed, setDoorSlammed] = useState(false)
  const [falling, setFalling] = useState(false)
  const timeoutsRef = useRef([])

  const states = useMemo(() => ({
    default: {
      '--figure-duration': '100',
      '--transform-figure': 'none',
      '--walking-duration': '100',
      '--transform-arm1': 'none',
      '--transform-wrist1': 'none',
      '--transform-arm2': 'none',
      '--transform-wrist2': 'none',
      '--transform-leg1': 'none',
      '--transform-calf1': 'none',
      '--transform-leg2': 'none',
      '--transform-calf2': 'none'
    },
    hover: {
      '--figure-duration': '100',
      '--transform-figure': 'translateX(1.5px)',
      '--walking-duration': '100',
      '--transform-arm1': 'rotate(-5deg)',
      '--transform-wrist1': 'rotate(-15deg)',
      '--transform-arm2': 'rotate(5deg)',
      '--transform-wrist2': 'rotate(6deg)',
      '--transform-leg1': 'rotate(-10deg)',
      '--transform-calf1': 'rotate(5deg)',
      '--transform-leg2': 'rotate(20deg)',
      '--transform-calf2': 'rotate(-20deg)'
    },
    walking1: {
      '--figure-duration': '300',
      '--transform-figure': 'translateX(11px)',
      '--walking-duration': '300',
      '--transform-arm1': 'translateX(-4px) translateY(-2px) rotate(120deg)',
      '--transform-wrist1': 'rotate(-5deg)',
      '--transform-arm2': 'translateX(4px) rotate(-110deg)',
      '--transform-wrist2': 'rotate(-5deg)',
      '--transform-leg1': 'translateX(-3px) rotate(80deg)',
      '--transform-calf1': 'rotate(-30deg)',
      '--transform-leg2': 'translateX(4px) rotate(-60deg)',
      '--transform-calf2': 'rotate(20deg)'
    },
    walking2: {
      '--figure-duration': '400',
      '--transform-figure': 'translateX(17px)',
      '--walking-duration': '300',
      '--transform-arm1': 'rotate(60deg)',
      '--transform-wrist1': 'rotate(-15deg)',
      '--transform-arm2': 'rotate(-45deg)',
      '--transform-wrist2': 'rotate(6deg)',
      '--transform-leg1': 'rotate(-5deg)',
      '--transform-calf1': 'rotate(10deg)',
      '--transform-leg2': 'rotate(10deg)',
      '--transform-calf2': 'rotate(-20deg)'
    },
    falling1: {
      '--figure-duration': '1600',
      '--walking-duration': '400',
      '--transform-arm1': 'rotate(-60deg)',
      '--transform-wrist1': 'none',
      '--transform-arm2': 'rotate(30deg)',
      '--transform-wrist2': 'rotate(120deg)',
      '--transform-leg1': 'rotate(-30deg)',
      '--transform-calf1': 'rotate(-20deg)',
      '--transform-leg2': 'rotate(20deg)'
    },
    falling2: {
      '--walking-duration': '300',
      '--transform-arm1': 'rotate(-100deg)',
      '--transform-arm2': 'rotate(-60deg)',
      '--transform-wrist2': 'rotate(60deg)',
      '--transform-leg1': 'rotate(80deg)',
      '--transform-calf1': 'rotate(20deg)',
      '--transform-leg2': 'rotate(-60deg)'
    },
    falling3: {
      '--walking-duration': '500',
      '--transform-arm1': 'rotate(-30deg)',
      '--transform-wrist1': 'rotate(40deg)',
      '--transform-arm2': 'rotate(50deg)',
      '--transform-wrist2': 'none',
      '--transform-leg1': 'rotate(-30deg)',
      '--transform-leg2': 'rotate(20deg)',
      '--transform-calf2': 'none'
    }
  }), [])

  const styleVars = states[state]

  const clearAll = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => () => clearAll(), [])

  const handleMouseEnter = () => {
    if (!clicked && state === 'default') setState('hover')
  }
  const handleMouseLeave = () => {
    if (!clicked && state === 'hover') setState('default')
  }

  const runSequence = () => {
    setClicked(true)
    setState('walking1')
    const t1 = setTimeout(() => {
      setDoorSlammed(true)
      setState('walking2')
      const t2 = setTimeout(() => {
        setFalling(true)
        setState('falling1')
        const t3 = setTimeout(() => {
          setState('falling2')
          const t4 = setTimeout(() => {
            setState('falling3')
            const t5 = setTimeout(() => {
              // Reset
              setClicked(false)
              setDoorSlammed(false)
              setFalling(false)
              setState('default')
              // Invoke logout action after animation completes
              try { onClick?.() } catch {}
            }, 1000)
            timeoutsRef.current.push(t5)
          }, Number(states.falling2['--walking-duration']))
          timeoutsRef.current.push(t4)
        }, Number(states.falling1['--walking-duration']))
        timeoutsRef.current.push(t3)
      }, Number(states.walking2['--figure-duration']))
      timeoutsRef.current.push(t2)
    }, Number(states.walking1['--figure-duration']))
    timeoutsRef.current.push(t1)
  }

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => { if (!clicked) runSequence() }}
      className={`logoutButton logoutButton--dark ${clicked ? 'clicked' : ''} ${doorSlammed ? 'door-slammed' : ''} ${falling ? 'falling' : ''} ${className}`}
      style={styleVars}
      aria-label="Log out"
    >
      <svg className="doorway" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
        <path className="bang" d="M40.5 43.7L26.6 31.4l-2.5 6.7zM41.9 50.4l-19.5-4-1.4 6.3zM40 57.4l-17.7 3.9 3.9 5.7z" />
      </svg>
      <svg className="figure" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="52.1" cy="32.4" r="6.4" />
        <path d="M50.7 62.8c-1.2 2.5-3.6 5-7.2 4-3.2-.9-4.9-3.5-4-7.8.7-3.4 3.1-13.8 4.1-15.8 1.7-3.4 1.6-4.6 7-3.7 4.3.7 4.6 2.5 4.3 5.4-.4 3.7-2.8 15.1-4.2 17.9z" />
        <g className="arm1">
          <path d="M55.5 56.5l-6-9.5c-1-1.5-.6-3.5.9-4.4 1.5-1 3.7-1.1 4.6.4l6.1 10c1 1.5.3 3.5-1.1 4.4-1.5.9-3.5.5-4.5-.9z" />
          <path className="wrist1" d="M69.4 59.9L58.1 58c-1.7-.3-2.9-1.9-2.6-3.7.3-1.7 1.9-2.9 3.7-2.6l11.4 1.9c1.7.3 2.9 1.9 2.6 3.7-.4 1.7-2 2.9-3.8 2.6z" />
        </g>
        <g className="arm2">
          <path d="M34.2 43.6L45 40.3c1.7-.6 3.5.3 4 2 .6 1.7-.3 4-2 4.5l-10.8 2.8c-1.7.6-3.5-.3-4-2-.6-1.6.3-3.4 2-4z" />
          <path className="wrist2" d="M27.1 56.2L32 45.7c.7-1.6 2.6-2.3 4.2-1.6 1.6.7 2.3 2.6 1.6 4.2L33 58.8c-.7 1.6-2.6 2.3-4.2 1.6-1.7-.7-2.4-2.6-1.7-4.2z" />
        </g>
        <g className="leg1">
          <path d="M52.1 73.2s-7-5.7-7.9-6.5c-.9-.9-1.2-3.5-.1-4.9 1.1-1.4 3.8-1.9 5.2-.9l7.9 7c1.4 1.1 1.7 3.5.7 4.9-1.1 1.4-4.4 1.5-5.8.4z" />
          <path className="calf1" d="M52.6 84.4l-1-12.8c-.1-1.9 1.5-3.6 3.5-3.7 2-.1 3.7 1.4 3.8 3.4l1 12.8c.1 1.9-1.5 3.6-3.5 3.7-2 0-3.7-1.5-3.8-3.4z" />
        </g>
        <g className="leg2">
          <path d="M37.8 72.7s1.3-10.2 1.6-11.4 2.4-2.8 4.1-2.6c1.7.2 3.6 2.3 3.4 4l-1.8 11.1c-.2 1.7-1.7 3.3-3.4 3.1-1.8-.2-4.1-2.4-3.9-4.2z" />
          <path className="calf2" d="M29.5 82.3l9.6-10.9c1.3-1.4 3.6-1.5 5.1-.1 1.5 1.4.4 4.9-.9 6.3l-8.5 9.6c-1.3 1.4-3.6 1.5-5.1.1-1.4-1.3-1.5-3.5-.2-5z" />
        </g>
      </svg>
      <svg className="door" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
        <circle cx="66" cy="50" r="3.7" />
      </svg>
      <span className="button-text">Log Out</span>

      <style jsx>{`
        .logoutButton {
          --figure-duration: 100ms;
          --transform-figure: none;
          --walking-duration: 100ms;
          --transform-arm1: none;
          --transform-wrist1: none;
          --transform-arm2: none;
          --transform-wrist2: none;
          --transform-leg1: none;
          --transform-calf1: none;
          --transform-leg2: none;
          --transform-calf2: none;

          background: none;
          border: 0;
          color: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Quicksand', sans-serif;
          font-size: 15px;
          font-weight: 600;
          height: 42px;
          outline: none;
          padding: 0 12px 0 16px;
          perspective: 100px;
          position: relative;
          text-align: center;
          width: auto;
          min-width: 140px;
          border-radius: 999px;
          -webkit-tap-highlight-color: transparent;
        }

        .logoutButton::before {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: 1px solid #b91c1c;
          border-radius: 999px;
          content: '';
          display: block;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          transform: none;
          transition: transform 80ms ease, background-color 180ms ease, box-shadow 180ms ease;
          width: 100%;
          z-index: 2;
          box-shadow: 0 8px 18px rgba(220, 38, 38, 0.35);
        }

        .logoutButton:hover::before { box-shadow: 0 12px 24px rgba(220, 38, 38, 0.45); }
        .logoutButton:hover .door { transform: rotateY(20deg); }
        .logoutButton:active::before { transform: scale(.98); }
        .logoutButton:active .door { transform: rotateY(28deg); }
        .logoutButton.clicked .door { transform: rotateY(35deg); }
        .logoutButton.door-slammed .door { transform: none; transition: transform 100ms ease-in 250ms; }

        .logoutButton.falling { animation: shake 200ms linear; }
        .logoutButton.falling .bang { animation: flash 300ms linear; }
        .logoutButton.falling .figure {
          animation: spin 1000ms infinite linear;
          bottom: -1080px;
          opacity: 0;
          right: 1px;
          transition: transform var(--figure-duration) linear,
            bottom var(--figure-duration) cubic-bezier(0.7, 0.1, 1, 1) 100ms,
            opacity calc(var(--figure-duration) * 0.25) linear calc(var(--figure-duration) * 0.75);
          z-index: 1;
        }

        .button-text { color: #ffffff; font-weight: 700; position: relative; z-index: 10; }
        .logoutButton svg { display: block; position: absolute; }
        .figure { bottom: 5px; fill: #ffffff; right: 18px; transform: var(--transform-figure); transition: transform var(--figure-duration) cubic-bezier(0.2, 0.1, 0.80, 0.9); width: 30px; z-index: 4; }
        .door, .doorway { bottom: 4px; fill: #ffffff; right: 12px; width: 32px; }
        .door { transform: rotateY(20deg); transform-origin: 100% 50%; transform-style: preserve-3d; transition: transform 200ms ease; z-index: 5; }
        .door path { fill: #ffffff; stroke: #ffffff; stroke-width: 4; }
        .doorway { z-index: 3; }
        .bang { opacity: 0; }

        .arm1, .wrist1, .arm2, .wrist2, .leg1, .calf1, .leg2, .calf2 { transition: transform var(--walking-duration) ease-in-out; }
        .arm1 { transform: var(--transform-arm1); transform-origin: 52% 45%; }
        .wrist1 { transform: var(--transform-wrist1); transform-origin: 59% 55%; }
        .arm2 { transform: var(--transform-arm2); transform-origin: 47% 43%; }
        .wrist2 { transform: var(--transform-wrist2); transform-origin: 35% 47%; }
        .leg1 { transform: var(--transform-leg1); transform-origin: 47% 64.5%; }
        .calf1 { transform: var(--transform-calf1); transform-origin: 55.5% 71.5%; }
        .leg2 { transform: var(--transform-leg2); transform-origin: 43% 63%; }
        .calf2 { transform: var(--transform-calf2); transform-origin: 41.5% 73%; }

        @keyframes spin { from { transform: rotate(0deg) scale(0.94); } to { transform: rotate(359deg) scale(0.94); } }
        @keyframes shake { 0% { transform: rotate(-1deg); } 50% { transform: rotate(2deg); } 100% { transform: rotate(-1deg); } }
        @keyframes flash { 0% { opacity: 0.4; } 100% { opacity: 0; } }
      `}</style>
    </button>
  )
}

export default LogoutBtn
