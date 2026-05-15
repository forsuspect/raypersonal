import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Workouts from '../components/Workouts'
import Transformations from '../components/Testimonials'
import Pricing from '../components/Pricing'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="relative bg-premium-white min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Workouts />
      <Transformations />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage
