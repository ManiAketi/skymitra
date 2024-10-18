'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  '/images/sky-hero-1.png',
  '/images/sky-hero-2.jpeg',
  '/images/sky-hero-3.jpeg',
  '/images/sky-hero-4.jpeg',
  '/images/sky-hero-5.jpeg',
  '/images/sky-hero-6.jpeg',
  '/images/sky-hero-7.jpeg',
  '/images/sky-hero-8.jpeg',

]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Hero image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className={`transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to SkyMithra
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Revolutionizing industries with cutting-edge drone technology
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </section>
  )
}