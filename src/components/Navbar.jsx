import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'

const navLinks = [
  { name: 'Início', href: '#hero' },
  { name: 'Sobre', href: '#sobre' },
  { name: 'Objetivos', href: '#objetivos' },
  { name: 'Transformações', href: '#transformacoes' },
  { name: 'Planos', href: '#planos' },
]

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-white/80 backdrop-blur-lg shadow-premium' : 'py-6 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex w-1/4">
            <Link to="/" className="flex items-center group">
              <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-12 sm:h-14 md:h-16 w-auto drop-shadow-md" />
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-wine-900/70 hover:text-wine-900 font-medium text-sm transition-colors relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-wine-900 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex w-1/4 justify-end items-center">
            <Link
              to="/login"
              className="hidden lg:block btn-premium py-2.5 px-6 text-sm whitespace-nowrap"
            >
              Portal da Aluna
            </Link>

            <button
              className="lg:hidden text-wine-900"
              onClick={() => setIsMobileOpen(true)}
            >
              <HiOutlineMenuAlt3 size={28} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-white lg:hidden h-screen w-full"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <Link to="/" className="flex items-center" onClick={() => setIsMobileOpen(false)}>
                  <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-12 w-auto" />
                </Link>
                <button onClick={() => setIsMobileOpen(false)} className="text-wine-900">
                  <HiX size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-2xl font-display font-bold text-wine-900 hover:text-bordeaux transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-12">
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="btn-premium w-full flex justify-center py-4 text-center"
                >
                  Portal da Aluna
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
