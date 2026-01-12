import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from '../index.js'
// Swiper is a popular, lightweight slider/carousel library.
// We use it here to build the homepage banner slider with:
// - Touch/drag support
// - Autoplay (slides change automatically)
// - Pagination dots
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

// Swiper base styles + module styles (required for proper layout and pagination UI)
import 'swiper/css'
import 'swiper/css/pagination'
import './slider.css'

import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide 2.png";
import slide3 from "../assets/slide3.png";
import slide4 from "../assets/s4.jpg";
import slide5 from "../assets/slide 5.avif";
import slide6 from "../assets/s6.avif";

const Slider = () => {
  // Banner images (static imports)
  const banners = [
    { id: 1, image: slide1, alt: "Slide 1" },
    { id: 2, image: slide2, alt: "Slide 2" },
    { id: 3, image: slide3, alt: "Slide 3" },
    { id: 4, image: slide4, alt: "Slide 4" },
    { id: 5, image: slide5, alt: "Slide 5" },
    { id: 6, image: slide6, alt: "Slide 6" }
  ];

  if (!banners.length) return null

  // Simple skeleton banner visibility: show briefly on mount
  // This avoids any "loading" text and keeps the hero visually stable.
  const [showSkeleton, setShowSkeleton] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full relative">
      <div className="mx-auto md:w-[90vw] md:max-w-300">
        {showSkeleton && (
          <div className="mb-3">
            <Loader type="banner" />
          </div>
        )}
        {/* Homepage skeleton banner while images prepare */}
        {/* Using a simple CSS-driven pulse; avoids "Loading..." text */}
        {/* Note: Swiper will render immediately, but this skeleton ensures the hero area feels responsive */}
        <Swiper
          className="centered-slide-carousel text-[#4169e1]"
          modules={[Pagination, Autoplay]}
          centeredSlides
          loop
          slideToClickedSlide
          // Auto slide change (one by one)
          speed={1000}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: false }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          breakpoints={{
            990: { slidesPerView: 1, spaceBetween: 0 },
            1028: { slidesPerView: 2, spaceBetween: 10 },
            // Slightly wider slides on large screens
            1920: { slidesPerView: 3, spaceBetween: 24 }
          }}
        >
          {banners.map((banner) => {
            let to = null
            // Routing rules:
            // 1) Slide 2 → /electronics
            // 2) Slides 1 & 5 → /grocery
            // 3) Slide 3 → /clothing
            if (banner.id === 2) to = '/electronics'
            else if (banner.id === 1 || banner.id === 5) to = '/grocery'
            else if (banner.id === 3) to = '/clothing'

            const isFirst = banner.id === 1
            const content = (
              <div className="rounded-2xl h-50 md:h-70 overflow-hidden border border-black/5 bg-gray-100">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className="w-full h-full object-cover object-center"
                    loading={isFirst ? "eager" : "lazy"}
                    decoding="async"
                    fetchpriority={isFirst ? "high" : "low"}
                  />
                ) : null}
              </div>
            )

            return (
              <SwiperSlide key={banner.id}>
                {to ? (
                  <Link to={to} aria-label={`Go to ${to.replace('/', '')}`}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
