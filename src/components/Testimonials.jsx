import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'

const transformations = [
  {
    name: 'Carolina Mendes',
    time: '4 meses',
    result: '-12kg',
    text: 'A Rayana não mudou apenas meu corpo, mudou minha forma de ver a vida. O nível de detalhe no acompanhamento é algo que nunca vi igual. Cada ajuste de carga, cada alteração na dieta foi fundamental.',
    before: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop',
  },
  {
    name: 'Beatriz Silva',
    time: '6 meses',
    result: '+5kg Massa Magra',
    text: 'Sempre tive dificuldade em ganhar massa. Com a consultoria de elite e os treinos focados em hipertrofia feminina, consegui o volume que sempre sonhei, mantendo a definição. É surreal!',
    before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=1470&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
  },
  {
    name: 'Amanda Costa',
    time: '3 meses',
    result: 'Definição Total',
    text: 'Após a gestação, achei que nunca mais recuperaria meu corpo. O protocolo pós-parto da Rayana foi tão cuidadoso e eficiente que hoje me sinto melhor do que antes da gravidez.',
    before: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop',
  }
]

const Transformations = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % transformations.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length)

  return (
    <section id="transformacoes" className="section-padding bg-wine-950 text-white relative overflow-hidden">
      {/* Decors */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-bordeaux/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-wine-900/20 blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-rose-soft font-bold text-xs uppercase tracking-[0.4em] mb-4 block italic">Casos de Sucesso</span>
          <h2 className="heading-lg mb-4">A <span className="text-wine-gradient italic serif bg-clip-text text-transparent bg-gradient-to-r from-rose-soft to-premium-white">Excelência</span> em Resultados</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Não são promessas, são resultados documentados. Conheça a evolução de mulheres 
            que decidiram elevar seu padrão de treino e vida.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative glass-dark rounded-[2.5rem] p-6 md:p-12 border border-white/10 shadow-premium-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                {/* Images */}
                <div className="flex gap-4">
                  <div className="w-1/2 relative">
                    <span className="absolute top-4 left-4 z-10 bg-wine-950/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">Antes</span>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/5 opacity-60">
                      <img src={transformations[currentIndex].before} alt="Antes" className="w-full h-full object-cover grayscale" />
                    </div>
                  </div>
                  <div className="w-1/2 relative mt-8">
                    <span className="absolute top-4 right-4 z-10 bg-bordeaux text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-premium">Depois</span>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-premium-lg">
                      <img src={transformations[currentIndex].after} alt="Depois" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col h-full justify-center">
                  <div className="flex text-rose-soft mb-6">
                    {[1, 2, 3, 4, 5].map(star => <FiStar key={star} className="fill-rose-soft" />)}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-serif italic text-white/90 mb-8 leading-relaxed">
                    "{transformations[currentIndex].text}"
                  </blockquote>

                  <div className="mt-auto border-t border-white/10 pt-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{transformations[currentIndex].name}</h4>
                      <p className="text-white/40 text-sm font-medium">{transformations[currentIndex].time} de consultoria</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
                      <span className="block text-rose-soft font-black text-xl leading-none">{transformations[currentIndex].result}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6">
              <button onClick={prev} className="w-12 h-12 rounded-full bg-white text-wine-950 flex items-center justify-center shadow-lg hover:bg-premium-light transition-colors">
                <FiChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6">
              <button onClick={next} className="w-12 h-12 rounded-full bg-white text-wine-950 flex items-center justify-center shadow-lg hover:bg-premium-light transition-colors">
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8">
            {transformations.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-rose-soft' : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Transformations
