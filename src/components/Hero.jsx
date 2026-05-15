import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden bg-premium-light"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
    >
      {/* Background blobs */}
      <div className="absolute top-16 left-8 w-40 h-40 bg-wine-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-56 h-56 bg-wine-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10"
        style={{ paddingTop: '72px' }} /* offset for fixed navbar */
      >

        {/* ── Text Column ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="w-full lg:w-[54%] flex flex-col justify-center text-center lg:text-left"
        >
          {/* Eyebrow */}
          <span className="inline-block text-bordeaux font-black text-[10px] uppercase tracking-[0.4em] mb-3 lg:mb-4">
            Consultoria Fitness Premium
          </span>

          {/* Heading — single line approach on desktop */}
          <h1 className="font-black leading-tight tracking-tight text-wine-950 mb-3"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.05 }}
          >
            Transforme seu{' '}
            <span className="text-wine-gradient italic">corpo</span>{' '}
            com treinos{' '}
            <span className="relative inline-block">
              personalizados
              <svg className="absolute -bottom-0.5 left-0 w-full h-1.5 text-bordeaux/25" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                <path d="M1 7C33.5 2.5 133.5 -1.5 199 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Sub */}
          <p className="text-sm text-wine-900/60 font-medium mb-5 max-w-[400px] mx-auto lg:mx-0 leading-relaxed">
            Metodologia exclusiva para estética corporal, definição e evolução saudável — resultados reais e duradouros.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-5">
            <a href="#planos" className="btn-premium py-3 px-7 text-sm w-full sm:w-auto flex items-center justify-center gap-2">
              Começar Agora <FiArrowRight size={15} />
            </a>
            <a href="#objetivos" className="btn-outline py-3 px-7 text-sm w-full sm:w-auto text-center">
              Conhecer Planos
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="flex -space-x-2.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-premium-light overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/80?u=${i + 20}`} alt="aluna" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-premium-light bg-wine-900 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                +500
              </div>
            </div>
            <div>
              <p className="text-wine-950 font-bold text-xs leading-none mb-0.5">+500 alunas satisfeitas</p>
              <p className="text-wine-900/40 text-[9px] uppercase font-black tracking-widest">Transformação real</p>
            </div>
          </div>
        </motion.div>

        {/* ── Image Column ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="hidden lg:flex w-[46%] justify-end relative"
        >
          {/* Photo */}
          <div
            className="relative rounded-[2rem] overflow-hidden border-[8px] border-white shadow-2xl"
            style={{ width: '100%', maxWidth: '380px', height: 'calc(100dvh - 140px)', maxHeight: '520px' }}
          >
            <img
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop"
              alt="Rayana Maria Personal"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950/25 via-transparent to-transparent" />
          </div>

          {/* Badge -15kg */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 -left-6 glass px-4 py-2.5 rounded-2xl shadow-premium z-20 flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-wine-900 flex items-center justify-center text-white shrink-0">
              <FiCheckCircle size={16} />
            </div>
            <div>
              <p className="text-wine-950 font-bold leading-none text-sm">-15kg</p>
              <p className="text-wine-900/60 text-[9px] uppercase font-bold mt-0.5 tracking-wider">Evolução Real</p>
            </div>
          </motion.div>

          {/* Badge VIP */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 -left-6 glass px-4 py-2.5 rounded-2xl shadow-premium z-20 flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-bordeaux flex items-center justify-center text-white font-black text-sm shrink-0">
              RM
            </div>
            <div>
              <p className="text-wine-950 font-bold leading-none text-sm">VIP</p>
              <p className="text-wine-900/60 text-[9px] uppercase font-bold mt-0.5 tracking-wider">Consultoria Elite</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
