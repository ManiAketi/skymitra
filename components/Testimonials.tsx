'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    content: "SkyMithra's drone services have revolutionized our agricultural practices. We've seen a significant increase in crop yield and efficiency.",
    author: "John Doe",
    role: "Farm Owner",
    image: "/images/testimonials/1.png",
  },
  {
    content: "The aerial surveys provided by SkyMithra have greatly improved our construction project planning and progress tracking.",
    author: "Jane Smith",
    role: "Project Manager",
    image: "/images/testimonials/2.png",
  },
  {
    content: "SkyMithra's surveillance drones have enhanced our security measures, providing us with real-time monitoring capabilities.",
    author: "Mike Johnson",
    role: "Security Director",
    image: "/images/testimonials/3.png",
  },
]

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What our clients say
          </p>
        </div>

        <div className="mt-10 relative">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-xl rounded-lg p-8">
              <p className="text-xl text-gray-600 italic mb-8">{testimonials[currentTestimonial].content}</p>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 relative">
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].author}
                    layout="fill"
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">{testimonials[currentTestimonial].author}</p>
                  <p className="text-base text-gray-500">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}