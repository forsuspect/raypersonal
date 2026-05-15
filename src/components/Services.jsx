import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight } from 'react-icons/fi'

const objectives = [
  { title: 'Emagrecimento', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop' },
  { title: 'Hipertrofia', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
  { title: 'Definição Corporal', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop' },
  { title: 'Protocolo Glúteos', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop' },
  { title: 'Abdômen', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Pós-parto', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Saúde Feminina', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Condicionamento', image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop' },
]

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="objetivos" className="relative bg-premium-light overflow-hidden" style={{ height: '100dvh' }}>
      <div ref={ref} className="h-full max-w-7xl mx-auto px-6 flex flex-col justify-center gap-6">
        <div className="text-center">
          <span className="text-bordeaux font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block italic">Resultados Direcionados</span>
          <h2 className="font-black leading-tight text-wine-950" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Escolha seu <span className="text-wine-gradient italic">Objetivo</span>
          </h2>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {objectives.map((obj, i) => (
            <motion.div
              key={obj.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ height: 'clamp(120px, 22dvh, 200px)' }}
            >
              <img src={obj.image} alt={obj.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950/90 via-wine-950/20 to-transparent group-hover:from-wine-950 transition-all duration-300" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                <h3 className="text-xs font-bold leading-tight">{obj.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Ver mais <FiArrowRight size={10} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
