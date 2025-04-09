'use client'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Your existing components
import Banner from '@/components/frontEnd/Banner'
import Cart from '@/components/frontEnd/Cart'
import Features from '@/components/frontEnd/Feature'
import Footer from '@/components/frontEnd/Footer'
import Hero from '@/components/frontEnd/Hero'
import NavBar from '@/components/frontEnd/NavBar'
import TrendingProducts from '@/components/frontEnd/TrendingProducts'
import ProductCard from '@/components/frontEnd/ProductCard'
import ReviewDisplay from '@/components/frontEnd/ReviewDisplay'
import ReviewForm from '@/components/frontEnd/reviewForm'
import CategoryGrid from '@/components/frontEnd/CategoryGrid'

const Home = () => {
  const [showCart, setShowCart] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Notification system */}

      {/* Sticky header with scroll effect */}
      <header className={`sticky top-0 z-40 transition-all ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
        <NavBar setShowCart={setShowCart} scrolled={scrolled} />
      </header>

      {/* Shopping cart sidebar */}
      {showCart && <Cart setShowCart={setShowCart} />}

      <main className="flex-grow">
        {/* Hero section */}
        <Hero className="bg-gradient-to-r from-blue-50 to-purple-50" />

        
        
        {/* Features grid */}
        <section className="py-0 px-1">
        <Features />
        </section>
        
        {/* Add this new section */}
        <CategoryGrid />
        {/* Trending products */}
        <section className="py-1 bg-white">
          <div className="container mx-auto px-1">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <button className="text-blue hover:underline">View All</button>
            </div>
            <TrendingProducts ProductCard={ProductCard} />
          </div>
        </section>

        {/* Promotional banner */}
        <Banner />

      </main>

      {/* Footer */}
      <Footer className="border-t border-gray-200" />

      {/* Floating action buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-30">
        <button 
          onClick={() => setShowCart(true)}
          className="p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        
        {scrolled && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Home