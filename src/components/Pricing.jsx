import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheck, FiArrowRight } from 'react-icons/fi'

const plans = [
  {
    name: 'Mensal',
    price: '297',
    desc: 'O início da sua jornada fitness.',
    features: ['Treino personalizado', 'Plano alimentar flexível', 'Suporte via App', 'Portal da aluna', 'Análise biomecânica'],
    highlight: false
  },
  {
    name: 'VIP Premium',
    price: '497',
    desc: 'Acompanhamento total para resultados rápidos.',
    features: ['Tudo do plano Mensal', 'Ajustes semanais de carga', 'Suporte prioritário 24/7', 'Calls de alinhamento mensais', 'Protocolos intensivos', 'Comunidade VIP'],
    highlight: true
  },
  {
    name: 'Trimestral',
    price: '797',
    desc: 'Compromisso com a sua transformação.',
    features: ['Benefícios VIP completos', 'Desconto no valor total', 'Planejamento de longo prazo', 'E-books exclusivos', 'Avaliação física completa'],
    highlight: false
  }
]

const Pricing = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="planos" className="relative bg-white overflow-hidden py-24" style={{ minHeight: '100dvh' }}>
      <div ref={ref} className="h-full max-w-7xl mx-auto px-6 flex flex-col justify-center gap-12">
        <div className="text-center">
          <span className="text-bordeaux font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block">Invista em Você</span>
          <h2 className="font-black leading-tight text-wine-950" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Planos <span className="text-wine-gradient italic">Premium</span>
          </h2>
        </div>

        <div className="flex md:grid overflow-x-auto snap-x snap-mandatory md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full pb-8 md:pb-0 px-4 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-6 rounded-[2rem] border-2 flex flex-col shrink-0 w-[85vw] sm:w-[300px] md:w-auto snap-center ${
                plan.highlight
                  ? 'border-wine-900 bg-white shadow-premium-lg md:scale-105 z-10'
                  : 'border-wine-100 bg-premium-light hover:border-wine-900/30 transition-colors'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-wine-900 text-white px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Mais escolhido
                </div>
              )}

              <h3 className="text-lg font-bold text-wine-950 mb-1">{plan.name}</h3>
              <p className="text-wine-900/50 text-xs mb-4">{plan.desc}</p>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-wine-900/40 text-sm font-bold">R$</span>
                <span className="text-wine-950 font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{plan.price}</span>
                <span className="text-wine-900/40 text-xs">/mês</span>
              </div>

              <div className="space-y-2 mb-5 flex-1">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-left">
                    <div className="w-4 h-4 rounded-full bg-wine-900/10 flex items-center justify-center shrink-0">
                      <FiCheck className="text-wine-900 text-[10px]" />
                    </div>
                    <span className="text-wine-900/70 text-xs">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                plan.highlight ? 'btn-premium' : 'btn-outline border-wine-100 text-wine-900/60 hover:border-wine-900'
              }`}>
                Assinar Agora <FiArrowRight size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
