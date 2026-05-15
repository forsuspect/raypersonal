import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiAward, FiSettings, FiTrendingUp, FiHeart } from 'react-icons/fi'

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="sobre" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-wine-900/[0.02] whitespace-nowrap pointer-events-none select-none">
        EVOLUÇÃO SAUDÁVEL
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-premium-lg aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
                alt="Rayana Maria - Lifestyle"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-premium z-20 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop"
                alt="Training details"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-bordeaux font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Elegância & Saúde</span>
            <h2 className="heading-lg text-wine-950 mb-8">
              A trajetória de <span className="text-wine-gradient italic serif">Rayana Maria</span>
            </h2>

            <div className="space-y-6 text-wine-900/70 leading-relaxed">
              <p>
                Com mais de 8 anos de experiência no mercado fitness de luxo, Rayana Maria consolidou sua
                carreira como uma das personal trainers mais influentes na transformação corporal feminina.
              </p>
              <p>
                Sua metodologia une a <span className="text-wine-950 font-bold">ciência do exercício</span> com uma
                abordagem <span className="text-wine-950 font-bold">comportamental e nutricional</span>, garantindo que
                cada aluna não apenas alcance seus objetivos estéticos, mas transforme seu lifestyle por completo.
              </p>
              <p>
                Especialista em biomecânica aplicada, Rayana desenvolveu protocolos exclusivos para hipertrofia,
                emagrecimento e definição, sempre respeitando a individualidade biológica e os ciclos hormonais femininos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12">
              {[
                { icon: FiAward, title: 'Elite Coach', sub: 'Acompanhamento VIP' },
                { icon: FiSettings, title: 'Biomecânica', sub: 'Técnica Avançada' },
                { icon: FiTrendingUp, title: 'Performance', sub: 'Resultados Reais' },
                { icon: FiHeart, title: 'Lifestyle', sub: 'Transformação Total' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-wine-50 border border-wine-100 flex flex-col items-start hover:shadow-premium transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-wine-900 text-white flex items-center justify-center mb-4 shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-wine-950 font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-wine-900/40 text-[10px] uppercase font-bold tracking-widest">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
