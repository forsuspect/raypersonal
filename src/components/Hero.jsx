import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[100svh] flex lg:items-start pt-24 pb-12 lg:pb-0 overflow-hidden bg-premium-light">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-wine-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-wine-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 relative z-10">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-[55%] flex flex-col justify-start text-center lg:text-left relative z-20"
        >
          <h1 className="heading-xl text-wine-950 mb-4 lg:mb-5">
            Transforme seu <span className="text-wine-gradient italic serif">corpo</span><br className="hidden md:block" /> com treinos
            <span className="relative inline-block ml-0 md:ml-3 mt-2 md:mt-0">
              personalizados
              <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-bordeaux/20" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M1 10.5C33.5 3.5 133.5 -3.5 199 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-base md:text-lg text-wine-950 lg:text-wine-900/70 font-medium lg:font-normal drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] lg:drop-shadow-none mb-6 lg:mb-8 max-w-[500px] mx-auto lg:mx-0 leading-relaxed">
            Consultoria fitness feminina focada em estética corporal, definição e evolução saudável.
            Metodologia exclusiva para resultados reais e duradouros.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
            <a href="#planos" className="btn-premium w-full sm:w-auto flex items-center justify-center gap-2">
              Começar Agora <FiArrowRight />
            </a>
            <a href="#objetivos" className="btn-outline w-full sm:w-auto text-center bg-white/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
              Conhecer Planos
            </a>
          </div>

          {/* Mini Stats/Proof */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-premium-light overflow-hidden shadow-sm relative z-10">
                  <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="aluna" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-premium-light bg-wine-900 flex items-center justify-center text-white text-xs font-bold shadow-sm relative z-20">
                +500
              </div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <p className="text-wine-950 font-bold text-sm">Alunas satisfeitas</p>
              <p className="text-wine-900/50 text-[10px] uppercase font-bold tracking-widest mt-0.5">Transformação real</p>
            </div>
          </div>
        </motion.div>

        {/* Image Content (Background on Mobile, Column on Desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0 lg:relative lg:w-[45%] flex justify-center lg:justify-end z-0 lg:z-20 opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
        >
          {/* Main Image Container */}
          <div className="relative z-10 w-full h-[60vh] lg:h-auto lg:rounded-[3rem] overflow-hidden lg:border-[12px] lg:border-white lg:shadow-premium-lg lg:aspect-[4/5] object-cover">
            <img
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop"
              alt="Rayana Maria Personal"
              className="w-full h-full object-cover object-center lg:object-cover"
            />
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-premium-light via-premium-light/70 to-transparent lg:from-wine-950/40 lg:via-transparent lg:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-premium-light via-premium-light/30 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-white/40 lg:hidden" />
          </div>

          {/* Floating Element 1 - Hidden on mobile to avoid clutter since image is background */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:flex absolute -top-4 -right-6 glass px-5 py-4 rounded-3xl shadow-premium z-20 items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-wine-900 flex items-center justify-center text-white">
              <FiCheckCircle size={20} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-wine-950 font-bold leading-none text-base">-15kg</p>
              <p className="text-wine-900/60 text-[10px] uppercase font-bold mt-1 tracking-wider">Evolução Real</p>
            </div>
          </motion.div>

          {/* Floating Element 2 - Hidden on mobile */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:flex absolute -bottom-4 -left-6 glass px-5 py-4 rounded-3xl shadow-premium z-20 items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-bordeaux flex items-center justify-center text-white font-display font-black text-base">
              RM
            </div>
            <div>
              <p className="text-wine-950 font-bold leading-none text-base">VIP</p>
              <p className="text-wine-900/60 text-[10px] uppercase font-bold mt-1 tracking-wider">Consultoria Elite</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
