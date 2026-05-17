import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const CTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const animatedInView = isMobile ? true : inView

  return (
    <section className="relative overflow-hidden bg-wine-900 text-white flex items-center justify-center" style={{ height: '70dvh', maxHeight: '600px' }}>
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-full bg-wine-950/50" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-bordeaux rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-wine-950 to-transparent pointer-events-none" />
      </div>

      <div ref={ref} className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={isMobile ? false : { opacity: 0, y: 30 }}
          animate={animatedInView ? { opacity: 1, y: 0 } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 0.6 }}
          className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-premium-lg"
        >
          <span className="text-rose-soft font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block italic">Vagas Limitadas</span>
          <h2 className="font-black mb-4 leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-white to-rose-soft italic serif">Melhor Versão</span> Começa Aqui.
          </h2>
          <p className="text-sm md:text-base text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
            O método Rayana Maria é exclusivo para mulheres prontas para investir em si mesmas. Junte-se ao time de elite.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            <a href="#planos" className="bg-white text-wine-950 font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg text-sm">
              Escolher Plano <FiArrowRight />
            </a>
            <a href="https://wa.me/558174016680" target="_blank" rel="noopener noreferrer" className="btn-outline border-white/30 text-white hover:bg-white hover:text-wine-950 flex justify-center items-center py-4 text-sm rounded-xl px-8">
              Falar no WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
            {['Acompanhamento VIP', 'Método Científico', 'Resultados'].map((text, i) => (
              <div key={i} className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                <FiCheckCircle className="text-rose-soft" size={12} /> {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
