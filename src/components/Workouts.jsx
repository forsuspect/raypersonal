import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiSmartphone, FiActivity, FiVideo, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'

const features = [
  { icon: FiSmartphone, title: 'App Exclusivo', desc: 'Treino na palma da mão com interface elegante.' },
  { icon: FiVideo, title: 'Vídeos Detalhados', desc: 'Execução perfeita com demonstrações HD.' },
  { icon: FiActivity, title: 'Cargas', desc: 'Registre e acompanhe sua evolução.' },
  { icon: FiTrendingUp, title: 'Estratégia', desc: 'Ajustes dinâmicos de intensidade.' },
]

const Workouts = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="treinos" className="relative bg-premium-white overflow-hidden flex items-center" style={{ height: '100dvh' }}>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-wine-50/30 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-bordeaux font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block italic">Plataforma VIP</span>
            <h2 className="font-black text-wine-950 mb-4 leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              Sua <span className="text-wine-gradient italic">Evolução</span> com Tecnologia
            </h2>
            <p className="text-wine-900/60 mb-6 text-sm leading-relaxed max-w-md">
              Ambiente digital projetado para maximizar seus resultados. O seu treino guiado passo a passo.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-wine-50 border border-wine-100 flex items-center justify-center shrink-0">
                    <feature.icon className="text-wine-900 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-wine-950 font-bold text-xs mb-0.5">{feature.title}</h4>
                    <p className="text-wine-900/60 text-[10px] leading-tight">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto w-full max-w-[280px] aspect-[1/2] bg-wine-950 rounded-[2.5rem] p-2.5 shadow-premium-lg border-4 border-wine-100" style={{ maxHeight: '65dvh' }}>
              <div className="w-full h-full bg-premium-white rounded-[2rem] overflow-hidden relative flex flex-col">
                <div className="bg-wine-950 text-white p-5 pb-6 rounded-b-2xl relative shadow-wine">
                  <div className="flex justify-between items-center mb-4">
                    <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-6 w-auto brightness-0 invert" />
                    <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
                       <img src="https://i.pravatar.cc/100?u=40" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-white/60 text-[10px] font-medium mb-1">Treino de Hoje</p>
                  <h3 className="text-xl font-bold font-serif italic">Inferiores</h3>
                  <div className="absolute -bottom-3 right-5 w-10 h-10 bg-bordeaux rounded-full flex items-center justify-center border-[3px] border-premium-white text-white shadow-premium">
                    <FiVideo size={14} />
                  </div>
                </div>

                <div className="p-4 pt-6 space-y-3 flex-1 overflow-hidden flex flex-col justify-center">
                  {[
                    { name: 'Agachamento', sets: '4x 10-12' },
                    { name: 'Leg Press 45', sets: '4x 12-15' },
                    { name: 'Cadeira Ext.', sets: '3x Falha' },
                  ].map((ex, i) => (
                    <div key={i} className="bg-wine-50 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop" alt="Exercício" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div>
                        <h4 className="text-wine-950 font-bold text-[11px]">{ex.name}</h4>
                        <p className="text-bordeaux font-bold text-[10px]">{ex.sets}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-3 border-t border-wine-100">
                    <div className="flex items-center justify-between mb-1.5">
                       <span className="text-[9px] text-wine-900/40 font-bold uppercase tracking-widest">Progresso</span>
                       <span className="text-xs text-wine-950 font-bold">65%</span>
                    </div>
                    <div className="w-full h-1.5 bg-wine-50 rounded-full overflow-hidden">
                       <div className="w-[65%] h-full bg-gradient-to-r from-bordeaux to-rose-gold rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/4 -left-8 glass p-3 rounded-2xl shadow-premium z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-soft/20 flex items-center justify-center text-rose-gold"><FiCheckCircle size={12} /></div>
              <span className="text-wine-950 font-bold text-xs">Treino Concluído</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Workouts
