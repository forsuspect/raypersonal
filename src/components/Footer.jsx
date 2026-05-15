import React from 'react'
import { FiInstagram, FiYoutube, FiMessageCircle, FiHeart } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-wine-950 text-white flex flex-col justify-end overflow-hidden relative" style={{ height: '30dvh', minHeight: '220px' }}>
      <div className="absolute bottom-0 right-0 text-[20vw] font-black text-white/[0.02] translate-y-1/4 translate-x-1/4 pointer-events-none">
        RM
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-10 w-auto brightness-0 invert mb-4" />
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><FiInstagram size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><FiYoutube size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><FiMessageCircle size={14} /></a>
            </div>
          </div>
          
          <div className="flex gap-8 md:gap-16 text-center md:text-left text-xs">
            <div>
              <h4 className="font-bold text-sm mb-2">Navegação</h4>
              <ul className="space-y-1">
                <li><a href="#hero" className="text-white/50 hover:text-white transition-colors">Início</a></li>
                <li><a href="#sobre" className="text-white/50 hover:text-white transition-colors">Sobre Mim</a></li>
                <li><a href="#planos" className="text-white/50 hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-2">Suporte</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Portal Aluna</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Termos Uso</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-center">
          <p className="text-white/30 text-[10px]">© {new Date().getFullYear()} Rayana Maria. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1.5 text-white/30 text-[10px] justify-center">
            Feito com <FiHeart size={10} className="text-bordeaux fill-bordeaux" /> para alunas dedicadas.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
