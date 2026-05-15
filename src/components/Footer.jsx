import React from 'react'
import { FiInstagram, FiYoutube, FiMessageCircle, FiHeart, FiArrowRight } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-wine-950 text-white relative overflow-hidden pt-16 md:pt-24 pb-8">
      {/* Decorative large text */}
      <div className="absolute bottom-[-10%] right-[-5%] text-[30vw] font-black text-white/[0.02] leading-none pointer-events-none select-none z-0">
        RM
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-6 mb-12">
          <div className="flex flex-col items-start text-left max-w-sm">
            <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-14 w-auto brightness-0 invert mb-6" />
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Transformando corpos e mentes através de protocolos de treino de elite. O método perfeito para quem busca resultados definitivos.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-bordeaux transition-colors hover:scale-110 duration-300"><FiInstagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-bordeaux transition-colors hover:scale-110 duration-300"><FiYoutube size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-bordeaux transition-colors hover:scale-110 duration-300"><FiMessageCircle size={18} /></a>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-12 md:gap-20 text-left text-sm mt-4 md:mt-0">
            <div>
              <h4 className="font-black uppercase tracking-widest text-white mb-6 text-xs">Navegação</h4>
              <ul className="space-y-4">
                <li><a href="#hero" className="text-white/50 hover:text-white transition-colors">Início</a></li>
                <li><a href="#sobre" className="text-white/50 hover:text-white transition-colors">Sobre Mim</a></li>
                <li><a href="#planos" className="text-white/50 hover:text-white transition-colors">Planos Exclusivos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-white mb-6 text-xs">Suporte</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Portal da Aluna</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-white/40 text-xs font-medium">© {new Date().getFullYear()} Rayana Maria. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2 text-white/40 text-xs font-medium justify-center bg-white/5 px-4 py-2 rounded-full">
            Feito com <FiHeart size={12} className="text-bordeaux fill-bordeaux animate-pulse" /> para alunas dedicadas
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
