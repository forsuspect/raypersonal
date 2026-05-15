import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight } from 'react-icons/fi'

const objectives = [
  { 
    title: 'Emagrecimento', 
    desc: 'Protocolos focados em queima calórica e preservação de massa magra.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop'
  },
  { 
    title: 'Hipertrofia', 
    desc: 'Ganho de volume muscular com densidade e qualidade estética.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop'
  },
  { 
    title: 'Definição Corporal', 
    desc: 'Realce suas curvas com treinos de alta intensidade e precisão.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop'
  },
  { 
    title: 'Protocolo Glúteos', 
    desc: 'Foco total em volume e densidade da região glútea.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop'
  },
  { 
    title: 'Abdômen', 
    desc: 'Estratégias para core forte e estética abdominal superior.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop'
  },
  { 
    title: 'Pós-parto', 
    desc: 'Recuperação segura e fortalecimento postural pós-gestação.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop'
  },
  { 
    title: 'Saúde Feminina', 
    desc: 'Ajustes conforme o ciclo hormonal para máxima eficácia.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop'
  },
  { 
    title: 'Condicionamento', 
    desc: 'Performance e fôlego para uma vida ativa e vigorosa.',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1470&auto=format&fit=crop'
  },
]

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="objetivos" className="section-padding bg-premium-light">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-bordeaux font-bold text-xs uppercase tracking-[0.4em] mb-4 block italic">Resultados Direcionados</span>
          <h2 className="heading-lg text-wine-950 mb-4">Escolha seu <span className="text-wine-gradient italic serif">Objetivo</span></h2>
          <p className="text-wine-900/60 max-w-2xl mx-auto">
            Cada corpo é único. Selecione sua meta e receba um protocolo 100% 
            personalizado para sua transformação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map((obj, i) => (
            <motion.div
              key={obj.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={obj.image} 
                alt={obj.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-rose-soft transition-colors">{obj.title}</h3>
                <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  {obj.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Saber mais <FiArrowRight />
                </div>
              </div>

              {/* Border decoration */}
              <div className="absolute inset-0 border-2 border-wine-900/0 group-hover:border-wine-900/20 rounded-3xl transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
