import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const CTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="relative py-24 overflow-hidden bg-wine-900 text-white">
      {/* Background Graphic */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-full bg-wine-950/50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-bordeaux rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-wine-950 to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 1 }}
          className="glass-dark p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-premium-lg"
        >
          <span className="text-rose-soft font-bold text-xs uppercase tracking-[0.4em] mb-6 block italic">Vagas Limitadas</span>

          <h2 className="heading-lg mb-6">
            Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-white to-rose-soft italic serif">Melhor Versão</span> Começa Aqui.
          </h2>

          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            O método Rayana Maria é exclusivo para mulheres que estão prontas para investir em si mesmas, 
            na sua saúde e estética. Junte-se ao time de elite hoje mesmo.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <a href="#planos" className="bg-white text-wine-950 font-bold px-10 py-5 rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg">
              Escolher Plano <FiArrowRight />
            </a>
            <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="btn-outline border-white/30 text-white hover:bg-white hover:text-wine-950 flex justify-center items-center">
              Falar no WhatsApp
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            {['Acompanhamento VIP', 'Método Científico', 'Resultados Comprovados'].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                <FiCheckCircle className="text-rose-soft" /> {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
