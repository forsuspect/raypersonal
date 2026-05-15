import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheck, FiArrowRight } from 'react-icons/fi'

const plans = [
  {
    name: 'Mensal',
    price: '297',
    desc: 'O início da sua jornada fitness.',
    features: [
      'Treino personalizado mensal',
      'Plano alimentar flexível',
      'Suporte via App',
      'Acesso ao portal da aluna',
      'Análise biomecânica básica'
    ],
    highlight: false
  },
  {
    name: 'VIP Premium',
    price: '497',
    desc: 'Acompanhamento total para resultados rápidos.',
    features: [
      'Tudo do plano Mensal',
      'Ajustes semanais de carga',
      'Suporte prioritário 24/7',
      'Calls de alinhamento mensais',
      'Protocolos específicos intensivos',
      'Comunidade VIP Exclusiva'
    ],
    highlight: true
  },
  {
    name: 'Trimestral',
    price: '797',
    desc: 'Compromisso com a sua transformação.',
    features: [
      'Mesmos benefícios do VIP',
      'Desconto no valor total',
      'Planejamento de longo prazo',
      'E-books exclusivos inclusos',
      'Avaliação física completa'
    ],
    highlight: false
  }
]

const Pricing = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="planos" className="section-padding bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16">
          <span className="text-bordeaux font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Invista em Você</span>
          <h2 className="heading-lg text-wine-950">Planos <span className="text-wine-gradient italic serif">Premium</span></h2>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 md:pb-0 px-4 md:px-0 md:grid md:grid-cols-3 md:gap-8 max-w-6xl mx-auto" style={{ scrollbarWidth: 'none' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative p-8 rounded-[40px] border-2 transition-all duration-500 flex flex-col min-w-[85vw] md:min-w-0 snap-center shrink-0 ${
                plan.highlight 
                  ? 'border-wine-900 bg-white shadow-premium-lg md:scale-105 z-10' 
                  : 'border-wine-100 bg-premium-light hover:border-wine-900/30'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-wine-900 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Mais escolhido
                </div>
              )}

              <h3 className="text-2xl font-bold text-wine-950 mb-2">{plan.name}</h3>
              <p className="text-wine-900/50 text-sm mb-8 leading-relaxed">{plan.desc}</p>
              
              <div className="mb-10 flex items-baseline gap-1 justify-center">
                <span className="text-wine-900/40 text-xl font-bold">R$</span>
                <span className="text-wine-950 font-display font-black text-6xl tracking-tighter">{plan.price}</span>
                <span className="text-wine-900/40 text-sm font-medium">/mês</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3 text-left">
                    <div className="w-5 h-5 rounded-full bg-wine-900/10 flex items-center justify-center shrink-0">
                      <FiCheck className="text-wine-900 text-xs" />
                    </div>
                    <span className="text-wine-900/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                plan.highlight 
                  ? 'btn-premium' 
                  : 'btn-outline border-wine-100 text-wine-900/60 hover:border-wine-900'
              }`}>
                Assinar Agora <FiArrowRight />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
