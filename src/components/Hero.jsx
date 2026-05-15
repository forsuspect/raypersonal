import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const Hero = () => {
  return (
    <section id="hero" className="relative h-screen max-h-screen flex items-center overflow-hidden bg-premium-light">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-wine-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-wine-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10 pt-16">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-[52%] flex flex-col justify-center text-center lg:text-left relative z-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.05] tracking-tight text-wine-950 mb-3">
            Transforme seu{' '}
            <span className="text-wine-gradient italic">corpo</span>
            {' '}com treinos{' '}
            <span className="relative inline-block">
              personalizados
              <svg className="absolute -bottom-1 left-0 w-full h-2 text-bordeaux/20" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M1 10.5C33.5 3.5 133.5 -3.5 199 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-sm md:text-base text-wine-900/60 font-medium mb-5 max-w-[420px] mx-auto lg:mx-0 leading-relaxed">
            Consultoria fitness feminina focada em estética corporal e evolução saudável. Metodologia exclusiva para resultados reais.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-6">
            <a href="#planos" className="btn-premium py-3 px-7 text-sm w-full sm:w-auto flex items-center justify-center gap-2">
              Começar Agora <FiArrowRight />
            </a>
            <a href="#objetivos" className="btn-outline py-3 px-7 text-sm w-full sm:w-auto text-center">
              Conhecer Planos
            </a>
          </div>

          {/* Mini Stats */}
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-premium-light overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="aluna" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-premium-light bg-wine-900 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                +500
              </div>
            </div>
            <div>
              <p className="text-wine-950 font-bold text-xs">Alunas satisfeitas</p>
              <p className="text-wine-900/40 text-[9px] uppercase font-black tracking-widest">Transformação real</p>
            </div>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="hidden lg:flex w-[48%] justify-end relative z-20"
        >
          <div className="relative w-full max-w-[420px] h-[calc(100vh-120px)] max-h-[560px] rounded-[2.5rem] overflow-hidden border-[10px] border-white shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop"
              alt="Rayana Maria Personal"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950/30 via-transparent to-transparent" />
          </div>

          {/* Floating Badge 1 */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 -left-8 glass px-4 py-3 rounded-2xl shadow-premium z-20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-wine-900 flex items-center justify-center text-white">
              <FiCheckCircle size={18} />
            </div>
            <div>
              <p className="text-wine-950 font-bold leading-none text-sm">-15kg</p>
              <p className="text-wine-900/60 text-[9px] uppercase font-bold mt-0.5 tracking-wider">Evolução Real</p>
            </div>
          </motion.div>

          {/* Floating Badge 2 */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-12 -left-8 glass px-4 py-3 rounded-2xl shadow-premium z-20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-bordeaux flex items-center justify-center text-white font-black text-sm">
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

