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
    <section id="planos" className="relative bg-[#060304] overflow-hidden py-16 md:py-24">
      <div ref={ref} className="h-full max-w-7xl mx-auto px-6 flex flex-col justify-center gap-12">
        <div className="text-center">
          <span className="text-bordeaux font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block">Invista em Você</span>
          <h2 className="font-black leading-tight text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
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
              className={`relative p-6 rounded-[2rem] border flex flex-col shrink-0 w-[85vw] sm:w-[300px] md:w-auto snap-center ${
                plan.highlight
                  ? 'border-bordeaux bg-wine-950/40 text-white shadow-premium-lg md:scale-105 z-10 backdrop-blur-xl'
                  : 'border-white/5 bg-white/5 text-white hover:border-white/20 transition-all backdrop-blur-md'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-wine-900 text-white px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Mais escolhido
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-white/50 text-xs mb-4">{plan.desc}</p>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-white/40 text-sm font-bold">R$</span>
                <span className="text-white font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{plan.price}</span>
                <span className="text-white/40 text-xs">/mês</span>
              </div>

              <div className="space-y-2 mb-5 flex-1">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-left">
                    <div className="w-4 h-4 rounded-full bg-bordeaux/20 flex items-center justify-center shrink-0">
                      <FiCheck className="text-rose-soft text-[10px]" />
                    </div>
                    <span className="text-white/70 text-xs">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                plan.highlight ? 'btn-premium' : 'border border-white/10 text-white hover:bg-white/5'
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
