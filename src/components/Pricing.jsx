import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheck, FiArrowRight } from 'react-icons/fi'

const WHATSAPP_NUMBER = '558174016680' // Insira o número do WhatsApp com DDD aqui (sem espaços ou caracteres especiais)

const plans = [
  {
    name: 'Mensal',
    price: '297',
    desc: 'O início da sua jornada fitness.',
    features: ['Treino personalizado', 'Plano alimentar flexível', 'Suporte via App', 'Portal da aluna', 'Análise biomecânica'],
    highlight: false,
    message: 'Olá, Rayana! Tenho interesse no Plano MENSAL da sua consultoria fitness premium. Gostaria de entender como funciona a avaliação e os treinos personalizados. Pode me ajudar?'
  },
  {
    name: 'VIP Premium',
    price: '497',
    desc: 'Acompanhamento total para resultados rápidos.',
    features: ['Tudo do plano Mensal', 'Ajustes semanais de carga', 'Suporte prioritário 24/7', 'Calls de alinhamento mensais', 'Protocolos intensivos', 'Comunidade VIP'],
    highlight: true,
    message: 'Olá, Rayana! Gostaria de me inscrever no Plano VIP PREMIUM. Estou pronta para ter um acompanhamento total, ajustes semanais de carga e suporte prioritário 24/7. Como posso realizar a minha matrícula?'
  },
  {
    name: 'Trimestral',
    price: '797',
    desc: 'Compromisso com a sua transformação.',
    features: ['Benefícios VIP completos', 'Desconto no valor total', 'Planejamento de longo prazo', 'E-books exclusivos', 'Avaliação física completa'],
    highlight: false,
    message: 'Olá, Rayana! Tenho interesse em assumir o compromisso de longo prazo com o Plano TRIMESTRAL. Quero garantir os benefícios VIP completos e o desconto especial. Qual o próximo passo?'
  }
]

const Pricing = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const animatedInView = isMobile ? true : inView

  return (
    <section id="planos" className="relative bg-premium-light overflow-hidden py-16 md:py-24">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-wine-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-bordeaux/5 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="h-full max-w-7xl mx-auto px-6 flex flex-col justify-center gap-12 relative z-10">
        <div className="text-center">
          <span className="text-bordeaux font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block">Invista em Você</span>
          <h2 className="font-black leading-tight text-wine-950" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Planos <span className="text-wine-gradient italic">Premium</span>
          </h2>
        </div>

        <div className="flex md:grid overflow-x-auto snap-x snap-mandatory md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full pt-10 pb-8 px-4 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {plans.map((plan, i) => {
            const encodedText = encodeURIComponent(plan.message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

            return (
              <motion.div
                key={plan.name}
                initial={isMobile ? false : { opacity: 0, y: 20 }}
                animate={animatedInView ? { opacity: 1, y: 0 } : {}}
                transition={isMobile ? { duration: 0 } : { duration: 0.5, delay: i * 0.1 }}
                className={`relative p-8 rounded-[2.5rem] border flex flex-col shrink-0 w-[82vw] sm:w-[320px] md:w-auto snap-center transition-all duration-300 ${
                  plan.highlight
                    ? 'border-bordeaux bg-white shadow-premium-xl md:scale-105 z-10 hover:shadow-2xl ring-4 ring-bordeaux/5'
                    : 'border-wine-100 bg-white/70 hover:border-wine-300 hover:shadow-premium-lg transition-all shadow-sm'
                }`}
                style={{ minHeight: '480px' }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-wine-900 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-md z-20 whitespace-nowrap">
                    Mais escolhido
                  </div>
                )}

                <h3 className="text-xl font-black text-wine-950 mb-1 tracking-tight">{plan.name}</h3>
                <p className="text-wine-900/60 text-xs font-semibold mb-6">{plan.desc}</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-wine-900/40 text-sm font-bold">R$</span>
                  <span className="text-wine-950 font-black tracking-tighter" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>{plan.price}</span>
                  <span className="text-wine-900/40 text-xs font-bold">/mês</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-left">
                      <div className="w-5 h-5 rounded-full bg-bordeaux/10 flex items-center justify-center shrink-0 border border-bordeaux/10">
                        <FiCheck className="text-bordeaux text-xs stroke-[3]" />
                      </div>
                      <span className="text-wine-900/80 text-xs font-bold">{feature}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.highlight 
                      ? 'bg-gradient-to-r from-wine-900 to-bordeaux text-white shadow-lg hover:shadow-wine hover:opacity-95' 
                      : 'border-2 border-wine-100 text-wine-900/70 hover:border-wine-900 hover:bg-wine-50/10'
                  }`}
                >
                  Assinar Agora <FiArrowRight size={14} className="stroke-[3]" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Pricing
