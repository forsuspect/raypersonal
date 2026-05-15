import React from 'react'
import { motion } from 'framer-motion'
import { FiInstagram, FiYoutube, FiMessageCircle, FiHeart } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-wine-950 text-white pt-8 pb-4 overflow-hidden relative">
      {/* Decorative background logo */}
      <div className="absolute bottom-0 right-0 text-[30vw] font-black text-white/[0.03] translate-y-1/3 translate-x-1/4 pointer-events-none">
        RM
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 mb-10">
          
          {/* Brand Info - Centered on Mobile, Left on Desktop */}
          <div className="md:max-w-sm flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-6">
              <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-16 w-auto brightness-0 invert" />
            </div>
            
            <p className="hidden md:block text-white/60 mb-8 text-sm leading-relaxed">
              Transformando vidas através do fitness de luxo e consultoria de alta performance. 
              Sua melhor versão começa com um compromisso real com a sua saúde.
            </p>

            {/* Social Icons - Centered on Mobile */}
            <div className="flex gap-4 justify-center md:justify-start w-full">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FiYoutube size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FiMessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Menus - Centered side-by-side on Mobile, Right on Desktop */}
          <div className="flex gap-12 md:gap-20 justify-center md:justify-end text-center md:text-left w-full md:w-auto">
            {/* Navigation */}
            <div>
              <h4 className="font-bold text-base mb-4">Navegação</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#hero" className="text-white/60 hover:text-white transition-colors">Início</a></li>
                <li><a href="#sobre" className="text-white/60 hover:text-white transition-colors">Sobre Mim</a></li>
                <li><a href="#objetivos" className="text-white/60 hover:text-white transition-colors">Objetivos</a></li>
                <li><a href="#transformacoes" className="text-white/60 hover:text-white transition-colors">Transformações</a></li>
                <li><a href="#planos" className="text-white/60 hover:text-white transition-colors">Planos Fitness</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-base mb-4">Suporte</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Portal Aluna</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Dúvidas FAQ</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Termos Uso</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Stacked and Centered on Mobile */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Rayana Maria. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs justify-center">
            Feito com <FiHeart size={12} className="text-bordeaux fill-bordeaux" /> para alunas dedicadas.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
