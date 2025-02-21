'use client'
import Banner from '@/components/frontEnd/Banner'
import Cart from '@/components/frontEnd/Cart'
import Features from '@/components/frontEnd/Feature'
import Footer from '@/components/frontEnd/Footer'
import Hero from '@/components/frontEnd/Hero'
import NavBar from '@/components/frontEnd/NavBar'
import TrendingProducts from '@/components/frontEnd/TrendingProducts'
import React, { useState } from 'react'

const Home = () => {
  const [showCart, setShowCart] = useState(false)
  return (
    <main>
      <NavBar setShowCart={setShowCart}/>
      { showCart && <Cart setShowCart={setShowCart}/>}
      <Hero/>
      <Features/>
      <TrendingProducts/>
      <Banner/>
      <Footer/>

    </main>
    
  )
}

export default Home