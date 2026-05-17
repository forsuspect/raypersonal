import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiArrowRight, FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#FAF8F5';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Hardcoded Admin Access
    if (email.trim() === 'admin' && password === 'admin') {
      navigate('/admin')
      return
    }

    try {
      // Direct database query for custom Username and Password
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', email.trim())
        .eq('senha', password)
        .limit(1)

      if (error || !data || data.length === 0) {
        throw new Error('Usuário ou senha incorretos.')
      }

      const user = data[0]

      // Check if student status is set to Inativo
      if (user.status === 'Inativo') {
        setError('inativa') // Set custom error code to trigger stylized inactive card
        return
      }

      // Use the returned data to determine navigation
      if (user.role === 'admin' || email.trim() === 'admin') {
        localStorage.setItem('rm_user', JSON.stringify({ ...user, usuario: email.trim() }))
        navigate('/admin')
      } else {
        localStorage.setItem('rm_user', JSON.stringify(user))
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Usuário ou senha incorretos. Tente novamente.')
      setTimeout(() => setError(null), 4000) // Message disappears after 4 seconds
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full flex bg-[#FAF8F5] overflow-hidden z-[100]">
      {/* Visual Left Side */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-wine-950 items-center justify-center overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop" 
            alt="Gym" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/50" />
        
        {/* Content */}
        <div className="relative z-10 p-12 text-center max-w-lg">
          <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-28 lg:h-32 w-auto mx-auto mb-10 brightness-0 invert" />
          <h2 className="text-4xl font-serif italic text-white mb-6">Onde seu esforço encontra a excelência.</h2>
          <p className="text-white/60 text-lg">
            Acesse o portal da aluna para visualizar seus treinos personalizados, métricas de evolução e muito mais.
          </p>
        </div>
      </div>

      {/* Login Right Side */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 relative bg-[#FAF8F5]">
        {/* Back Link */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-wine-900/60 hover:text-wine-950 font-bold text-sm transition-colors group"
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Voltar para o site
        </Link>

        {/* Mobile Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-wine-100/50 rounded-full blur-3xl -z-10 lg:hidden" />
        
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center mb-10 lg:hidden justify-center">
            <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-20 sm:h-24 w-auto drop-shadow-md" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-premium-lg border border-wine-100/50 relative"
          >
            <h1 className="text-3xl font-black text-wine-950 tracking-tighter mb-2">Portal da Aluna</h1>
            <p className="text-wine-900/50 text-sm mb-8 font-medium">Entre para acessar seu plano.</p>

            {error && (
              error === 'inativa' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-5 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex flex-col gap-3 text-amber-200 text-sm font-semibold shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
                      <FiAlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-amber-650 uppercase tracking-wider text-[10px]">Acesso Temporário Suspenso</h4>
                      <p className="text-amber-700/80 text-[11px] font-bold">Sua conta está definida como inativa.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed font-bold mt-1">
                    Fale diretamente com a sua personal trainer para reativar o seu portal de aluna.
                  </p>
                  <a 
                    href="https://wa.me/5500000000000?text=Olá, Rayana! Meu acesso ao portal está inativo. Poderia me ajudar a reativar minha conta?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-amber-600 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all flex items-center justify-center gap-1.5 shadow-sm mt-1"
                  >
                    Suporte WhatsApp
                  </a>
                </motion.div>
              ) : (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm font-semibold">
                  <FiAlertCircle className="mt-0.5 flex-shrink-0 text-rose-600" size={16} />
                  <p>{error}</p>
                </div>
              )
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-wine-900/60 uppercase tracking-widest mb-2">Usuário</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-wine-900/40">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-wine-50/50 border border-wine-100 rounded-2xl focus:outline-none focus:border-wine-900 focus:ring-1 focus:ring-wine-900 transition-colors text-wine-950 font-bold text-sm placeholder-wine-950/30"
                    placeholder="Seu usuário"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-wine-900/60 uppercase tracking-widest mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-wine-900/40">
                    <FiLock />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-wine-50/50 border border-wine-100 rounded-2xl focus:outline-none focus:border-wine-900 focus:ring-1 focus:ring-wine-900 transition-colors text-wine-950 font-bold text-sm placeholder-wine-950/30 mb-2"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <button 
                    type="button"
                    onClick={() => {
                      setError('A recuperação de senha deve ser solicitada diretamente à sua personal.')
                      setTimeout(() => setError(null), 6000)
                    }}
                    className="text-xs text-bordeaux font-black hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-wine transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Entrando...' : (
                  <>Acessar <FiArrowRight /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
