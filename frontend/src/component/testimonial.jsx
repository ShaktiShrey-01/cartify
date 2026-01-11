import React from 'react'

const testimonials = [
  {
    name: 'Aarav Mehta',
    quote:
      'Absolutely love the quality and speed of delivery. This site has become my go-to for everything!',
  },
  {
    name: 'Priya Sharma',
    quote:
      'The customer service was outstanding. I had an issue and they resolved it within minutes!',
  },
]

const Testimonial = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-900 tracking-tight drop-shadow-sm">
        Real Stories from Happy Shoppers!
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-green-600 text-white rounded-xl shadow-lg w-96 p-6 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">
              👤
            </div>
            <p className="italic mb-4">"{t.quote}"</p>
            <span className="font-bold">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
