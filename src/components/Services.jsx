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
  { title: 'Saúde Feminina', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop' },
  { title: 'Condicionamento', image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop' },
]

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const animatedInView = isMobile ? true : inView

  return (
    <section id="objetivos" className="relative bg-premium-light overflow-hidden py-16 md:py-24">
      <div ref={ref} className="w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-10">
        <div className="text-center">
          <span className="text-bordeaux font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 block italic">Resultados Direcionados</span>
          <h2 className="font-black leading-tight text-wine-950" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Escolha seu <span className="text-wine-gradient italic">Objetivo</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
          {objectives.map((obj, i) => (
            <motion.div
              key={obj.title}
              initial={isMobile ? false : { opacity: 0, y: 30 }}
              animate={animatedInView ? { opacity: 1, y: 0 } : {}}
              transition={isMobile 
                ? { duration: 0 } 
                : { duration: 0.6, delay: i * 0.08, type: "spring", stiffness: 100 }
              }
              className="group relative rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-wine/30 transition-all duration-500 w-full aspect-[3/4] md:aspect-auto"
              style={{ minHeight: '200px' }}
            >
              <img src={obj.image} alt={obj.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.15]" />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950/95 via-wine-950/40 to-transparent group-hover:from-wine-950 transition-all duration-500" />
              <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end text-white">
                <h3 className="text-xs md:text-base font-black leading-tight drop-shadow-lg">{obj.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-bordeaux opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  Descobrir <FiArrowRight size={12} />
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
