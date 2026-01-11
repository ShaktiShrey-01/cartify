import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Loader from "./Loader";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // Brief skeleton on mount to avoid awkward appearance during page load
    const t = setTimeout(() => setShowSkeleton(false), 600);
    setShowSkeleton(true);
    return () => clearTimeout(t);
  }, []);

  return (
    <footer className="w-full flex justify-center p-0 mt-auto mb-3">
      {/* Container: relative added to allow absolute positioning of text on mobile */}
      {showSkeleton ? (
        <Loader type="footer" />
      ) : (
        <div className="relative w-[98vw] min-w-90 max-w-375 h-10 md:h-12 flex items-center justify-center px-4 rounded-full ring-[#4169e1]/85 ring-2 backdrop-blur-md shadow-[0_-10px_20px_-12px_rgba(0,0,0,0.35)] bg-white/55 text-black">
        
        {/* Copyright Text: Absolute on mobile to keep it left without pushing icons */}
        <div className="absolute left-4 md:relative md:left-0 md:order-1 text-[10px] md:text-xs font-medium text-black">
          © {currentYear} <span className="text-[#4169e1] font-bold">Cartify</span>
        </div>

        {/* Social Links: Stays centered */}
        <div className="flex items-center justify-center gap-2 md:gap-3 md:order-2 md:flex-1 md:-translate-x-10">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-black text-black bg-transparent hover:bg-[#4169e1] hover:border-[#4169e1] hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 md:w-5 md:h-5">
              <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.088 3.292 9.395 7.867 10.915.575.106.785-.25.785-.556 0-.274-.01-1.183-.015-2.147-3.199.696-3.873-1.375-3.873-1.375-.523-1.328-1.277-1.682-1.277-1.682-1.043-.713.079-.699.079-.699 1.152.081 1.758 1.184 1.758 1.184 1.026 1.759 2.691 1.251 3.346.957.104-.743.401-1.251.729-1.539-2.553-.29-5.238-1.277-5.238-5.684 0-1.256.45-2.282 1.184-3.086-.119-.29-.513-1.459.112-3.043 0 0 .965-.309 3.162 1.18a11.03 11.03 0 0 1 2.879-.387c.977.004 1.962.132 2.879.387 2.194-1.489 3.157-1.18 3.157-1.18.627 1.584.233 2.753.114 3.043.737.804 1.183 1.83 1.183 3.086 0 4.419-2.69 5.389-5.253 5.673.41.354.776 1.052.776 2.122 0 1.532-.014 2.767-.014 3.144 0 .308.206.667.79.554C20.213 21.39 23.5 17.083 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/shakti33"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-[#0a66c2] text-[#0a66c2] bg-transparent hover:bg-[#0a66c2] hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 md:w-5 md:h-5">
              <path d="M20.447 20.452h-3.554V14.87c0-1.333-.024-3.053-1.86-3.053-1.861 0-2.146 1.45-2.146 2.95v5.685H9.333V9h3.414v1.561h.049c.476-.9 1.637-1.848 3.369-1.848 3.602 0 4.268 2.371 4.268 5.455v6.284ZM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123ZM7.113 20.452H3.56V9h3.553v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-[#111111] text-[#111111] bg-transparent hover:bg-[#111111] hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 md:w-5 md:h-5">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.5 11.24H16.17l-5.214-6.817-5.963 6.817H1.685l7.73-8.84-8.2-10.66h6.7l4.713 6.171 5.616-6.171Zm-1.162 17.52h1.833L7.05 4.126H5.06l12.022 15.644Z" />
            </svg>
          </a>
        </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;