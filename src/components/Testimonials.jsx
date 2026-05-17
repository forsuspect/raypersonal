import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'

const transformations = [
  {
    name: 'Carolina Mendes', time: '4 meses', result: '-12kg',
    text: 'A Rayana não mudou apenas meu corpo, mudou minha forma de ver a vida. Cada ajuste de carga e alteração na dieta foi fundamental para minha transformação.',
    before: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Beatriz Silva', time: '6 meses', result: '+5kg Massa',
    text: 'Com os treinos de hipertrofia feminina consegui o volume que sempre sonhei, mantendo a definição. É surreal!',
    before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=800&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Amanda Costa', time: '3 meses', result: 'Definição Total',
    text: 'O protocolo pós-parto foi tão cuidadoso que hoje me sinto melhor do que antes da gravidez. Resultado incrível!',
    before: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  }
]

const Transformations = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const next = () => setCurrentIndex((prev) => (prev + 1) % transformations.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length)

  return (
    <section id="transformacoes" className="relative bg-wine-950 text-white overflow-hidden py-16 md:py-24">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-bordeaux/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-wine-900/20 blur-[100px] pointer-events-none" />

      <div ref={ref} className="h-full max-w-7xl mx-auto px-6 flex flex-col justify-center gap-5 relative z-10">
        <div className="text-center">
          <span className="text-rose-soft font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block italic">Casos de Sucesso</span>
          <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-soft to-premium-white italic">Excelência</span> em Resultados
          </h2>
        </div>

        <div className="max-w-4xl mx-auto w-full relative">
          <div className="glass-dark rounded-[2rem] p-5 md:p-8 border border-white/10 shadow-premium-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-2 gap-8 items-center"
              >
                {/* Images */}
                <div className="flex gap-3">
                  <div className="w-1/2 relative">
                    <span className="absolute top-3 left-3 z-10 bg-wine-950/80 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10">Antes</span>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-white/5 opacity-60">
                      <img src={transformations[currentIndex].before} alt="Antes" className="w-full h-full object-cover grayscale" />
                    </div>
                  </div>
                  <div className="w-1/2 relative mt-6">
                    <span className="absolute top-3 right-3 z-10 bg-bordeaux text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">Depois</span>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border-4 border-white shadow-premium-lg">
                      <img src={transformations[currentIndex].after} alt="Depois" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center">
                  <div className="flex text-rose-soft mb-4">
                    {[1,2,3,4,5].map(s => <FiStar key={s} className="fill-rose-soft" size={14} />)}
                  </div>
                  <blockquote className="text-base md:text-lg font-serif italic text-white/90 mb-5 leading-relaxed">
                    "{transformations[currentIndex].text}"
                  </blockquote>
                  <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base">{transformations[currentIndex].name}</h4>
                      <p className="text-white/40 text-xs">{transformations[currentIndex].time} de consultoria</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
                      <span className="block text-rose-soft font-black text-lg leading-none">{transformations[currentIndex].result}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-5">
              <button onClick={prev} className="w-10 h-10 rounded-full bg-white text-wine-950 flex items-center justify-center shadow-lg hover:bg-premium-light transition-colors">
                <FiChevronLeft size={20} />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-5">
              <button onClick={next} className="w-10 h-10 rounded-full bg-white text-wine-950 flex items-center justify-center shadow-lg hover:bg-premium-light transition-colors">
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {transformations.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-rose-soft' : 'w-4 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Transformations
