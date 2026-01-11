import React from 'react'
import {Slider,Testimonial,Categories,Featured} from "../index.js"  


const Home = () => {
  return (
    <main className="flex-1 w-full">
      {/* Banner Slider Section */}
      <section className="pt-1 md:pt-2 pb-0 md:pb-0 px-2">
        <Slider />
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Featured Section */}
      <Featured />

      {/* Testimonials Section */}
      <Testimonial />

      {/* Other Content */}
    </main>
  )
}

export default Home
