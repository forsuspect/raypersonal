import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiAward, FiSettings, FiTrendingUp, FiHeart } from 'react-icons/fi'

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="sobre" className="relative bg-white overflow-hidden" style={{ height: '100dvh' }}>
      <div ref={ref} className="h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl overflow-hidden shadow-premium-lg" style={{ height: '70dvh', maxHeight: '520px' }}>
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
                alt="Rayana Maria"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <span className="text-bordeaux font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">Elegância & Saúde</span>
            <h2 className="font-black leading-tight tracking-tight text-wine-950 mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
              A trajetória de <span className="text-wine-gradient italic">Rayana Maria</span>
            </h2>

            <div className="space-y-3 text-wine-900/70 text-sm leading-relaxed mb-6">
              <p>Com mais de 8 anos no mercado fitness de luxo, Rayana Maria é referência na transformação corporal feminina.</p>
              <p>Sua metodologia une <span className="text-wine-950 font-bold">ciência do exercício</span> com uma abordagem <span className="text-wine-950 font-bold">comportamental e nutricional</span>, garantindo resultados reais.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FiAward, title: 'Elite Coach', sub: 'Acompanhamento VIP' },
                { icon: FiSettings, title: 'Biomecânica', sub: 'Técnica Avançada' },
                { icon: FiTrendingUp, title: 'Performance', sub: 'Resultados Reais' },
                { icon: FiHeart, title: 'Lifestyle', sub: 'Transformação Total' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-wine-50 border border-wine-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-wine-900 text-white flex items-center justify-center shrink-0">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-wine-950 font-bold text-sm">{item.title}</h4>
                    <p className="text-wine-900/40 text-[9px] uppercase font-black tracking-widest">{item.sub}</p>
                  </div>
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
