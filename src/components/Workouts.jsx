import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiSmartphone, FiActivity, FiVideo, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'

const features = [
  { 
    icon: FiSmartphone, 
    title: 'Aplicativo Exclusivo', 
    desc: 'Seu treino na palma da mão com uma interface elegante, feminina e fácil de usar.' 
  },
  { 
    icon: FiVideo, 
    title: 'Vídeos Detalhados', 
    desc: 'Garanta a execução perfeita com demonstrações em alta resolução para cada exercício.' 
  },
  { 
    icon: FiActivity, 
    title: 'Controle de Cargas', 
    desc: 'Registre sua evolução de força e acompanhe o aumento de performance semana a semana.' 
  },
  { 
    icon: FiTrendingUp, 
    title: 'Inteligência e Estratégia', 
    desc: 'Ajustes dinâmicos de intensidade respeitando seu corpo, rotina e ciclo hormonal.' 
  },
]

const Workouts = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="treinos" className="section-padding bg-premium-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-wine-50/30 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-bordeaux font-bold text-xs uppercase tracking-[0.4em] mb-4 block italic">Plataforma VIP</span>
            <h2 className="heading-lg text-wine-950 mb-6">
              Sua <span className="text-wine-gradient italic serif">Evolução</span> Guiada pela Tecnologia
            </h2>
            <p className="text-wine-900/60 mb-10 leading-relaxed max-w-lg">
              Esqueça planilhas confusas. Como aluna da consultoria Rayana Maria, você tem acesso 
              a um ambiente digital sofisticado, projetado para maximizar seus resultados e tornar 
              seu treino a melhor parte do seu dia.
            </p>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-wine-50 border border-wine-100 flex items-center justify-center shrink-0">
                    <feature.icon className="text-wine-900 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-wine-950 font-bold mb-1">{feature.title}</h4>
                    <p className="text-wine-900/60 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Showcase (Mockup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Abstract Phone Mockup */}
            <div className="relative mx-auto w-full max-w-[340px] aspect-[1/2] bg-wine-950 rounded-[3rem] p-3 shadow-premium-lg border-4 border-wine-100">
              <div className="w-full h-full bg-premium-white rounded-[2.5rem] overflow-hidden relative">
                {/* Mockup Header */}
                <div className="bg-wine-950 text-white p-6 pb-8 rounded-b-3xl relative shadow-wine">
                  <div className="flex justify-between items-center mb-6">
                    <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-8 w-auto brightness-0 invert" />
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                       <img src="https://i.pravatar.cc/100?u=40" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-white/60 text-xs font-medium mb-1">Treino de Hoje</p>
                  <h3 className="text-2xl font-bold font-serif italic">Membros Inferiores</h3>
                  <div className="absolute -bottom-4 right-6 w-12 h-12 bg-bordeaux rounded-full flex items-center justify-center border-4 border-premium-white text-white shadow-premium">
                    <FiVideo />
                  </div>
                </div>

                {/* Mockup Body */}
                <div className="p-6 pt-8 space-y-4">
                  {[
                    { name: 'Agachamento Livre', sets: '4x 10-12' },
                    { name: 'Leg Press 45', sets: '4x 12-15' },
                    { name: 'Cadeira Extensora', sets: '3x Até a falha' },
                    { name: 'Elevação Pélvica', sets: '4x 10 + 10s iso' },
                  ].map((ex, i) => (
                    <div key={i} className="bg-wine-50 p-4 rounded-2xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop" alt="Exercício" className="w-full h-full object-cover rounded-xl opacity-80" />
                      </div>
                      <div>
                        <h4 className="text-wine-950 font-bold text-sm">{ex.name}</h4>
                        <p className="text-bordeaux font-bold text-xs">{ex.sets}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 pt-4 border-t border-wine-100 flex items-center justify-between">
                     <span className="text-xs text-wine-900/40 font-bold uppercase tracking-widest">Progresso</span>
                     <span className="text-sm text-wine-950 font-bold">65%</span>
                  </div>
                  <div className="w-full h-2 bg-wine-50 rounded-full overflow-hidden">
                     <div className="w-[65%] h-full bg-gradient-to-r from-bordeaux to-rose-gold rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements around mockup */}
            <div className="absolute top-1/4 -left-12 glass p-4 rounded-2xl shadow-premium z-10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-soft/20 flex items-center justify-center text-rose-gold"><FiCheckCircle /></div>
              <span className="text-wine-950 font-bold text-sm">Treino Concluído</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Workouts
