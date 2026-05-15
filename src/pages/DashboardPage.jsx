import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiHome, FiActivity, FiMessageCircle, FiUser,
  FiMenu, FiX, FiDroplet, FiTarget, FiArrowLeft, FiCheck, FiCheckCircle,
  FiTrendingUp, FiSettings, FiLogOut, FiVideo, FiCalendar, FiShield
} from 'react-icons/fi'
import { supabase } from '../lib/supabase'

// MOCK_USER removed to fix build

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [completedExercises, setCompletedExercises] = useState([])
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false)
  const [activeWorkoutTab, setActiveWorkoutTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('rm_user')
      if (!storedUser) {
        navigate('/login')
        return
      }

      const user = JSON.parse(storedUser)
      
      // Verify if user still exists in DB and get latest workout
      try {
        const { data: userFromDb, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('usuario', user.usuario)
          .single()

        if (userError || !userFromDb) {
          localStorage.removeItem('rm_user')
          navigate('/login')
          return
        }
        setUserData(userFromDb)

        // Fetch latest workout
        const { data: workoutData, error: workoutError } = await supabase
          .from('planilhas_treino')
          .select('*')
          .eq('aluna_id', userFromDb.id)
          .eq('ativo', true)
          .order('data_criacao', { ascending: false })
          .limit(1)
          .single()

        if (!workoutError && workoutData) {
          setActiveWorkout(workoutData)
          
          // Check if already finished today
          const today = new Date().toDateString()
          const finishedDate = localStorage.getItem(`finished_${userFromDb.id}`)
          if (finishedDate === today) {
            setIsWorkoutFinished(true)
          }
        }
      } catch (err) {
        console.error("Error verifying user or fetching workout:", err)
        setUserData(user)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [navigate])

  useEffect(() => {
    const currentExercises = activeWorkout?.conteudo_treino?.workouts 
      ? activeWorkout.conteudo_treino.workouts[activeWorkoutTab]?.exercises 
      : activeWorkout?.conteudo_treino?.exercises;

    if (activeWorkout && completedExercises.length > 0 && completedExercises.length === currentExercises?.length) {
      if (!isWorkoutFinished) {
        setIsWorkoutFinished(true)
        if (userData) {
          localStorage.setItem(`finished_${userData.id}`, new Date().toDateString())
        }
        
        // Auto switch to overview with a small delay for better UX
        setTimeout(() => {
          setActiveTab('overview')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 800)
      }
    }
  }, [completedExercises, activeWorkout, userData, isWorkoutFinished, activeWorkoutTab])

  if (loading) return (
    <div className="min-h-screen bg-premium-light flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine-900"></div>
    </div>
  )

  const userDisplay = {
    name: userData?.nome || userData?.usuario || 'Aluna RM',
    plan: userData?.plano || 'VIP Premium',
    avatar: userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.usuario || 'RM'}&background=4A0E0E&color=fff`
  }

  const menuItems = [
    { id: 'overview', icon: FiHome, label: 'Visão Geral' },
    { id: 'workout', icon: FiActivity, label: 'Meu Treino' },
    { id: 'evolution', icon: FiTrendingUp, label: 'Evolução' },
    { id: 'chat', icon: FiMessageCircle, label: 'Chat VIP' },
    { id: 'profile', icon: FiUser, label: 'Meu Perfil' },
  ]

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#141210' }}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 p-6 h-full z-20 border-r" style={{ backgroundColor: '#1c1916', borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center mb-10">
          <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-10 w-auto brightness-0 invert" />
        </Link>

        <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Menu Principal</p>
        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                activeTab === item.id
                  ? 'text-white'
                  : 'hover:text-white font-medium'
              }`}
              style={{
                backgroundColor: activeTab === item.id ? 'rgba(136,19,55,0.2)' : 'transparent',
                color: activeTab === item.id ? '#ffffff' : 'rgba(255,255,255,0.35)',
                border: activeTab === item.id ? '1px solid rgba(136,19,55,0.4)' : '1px solid transparent'
              }}
            >
              <item.icon size={18} style={{ color: activeTab === item.id ? '#881337' : undefined }} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-4 mt-auto space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* User card at bottom */}
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <img src={userDisplay.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: 'rgba(136,19,55,0.4)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{userDisplay.name}</p>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#881337' }}>{userDisplay.plan}</p>
            </div>
            <button
              onClick={() => { localStorage.removeItem('rm_user'); navigate('/login') }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              title="Sair"
            >
              <FiLogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative" style={{ backgroundColor: '#141210' }}>
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-5 sticky top-0 z-30" style={{ backgroundColor: '#141210', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div />
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-none mb-1">{userDisplay.name}</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#881337' }}>{userDisplay.plan}</p>
            </div>
            <img src={userDisplay.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: 'rgba(136,19,55,0.3)' }} />
          </div>
        </header>

        {/* Mobile Header */}
        <div className="lg:hidden p-4 flex items-center justify-between sticky top-0 z-30" style={{ backgroundColor: '#1c1916', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" className="flex items-center">
            <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-3">
            <img src={userDisplay.avatar} alt="Avatar" className="w-8 h-8 rounded-full border" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Header Welcome */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="heading-md text-white mb-2">Olá, {userDisplay.name.split(' ')[0]} 👋</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>{isWorkoutFinished ? 'Missão cumprida por hoje! Aproveite seu descanso.' : 'Pronta para o treino de hoje? Vamos juntas.'}</p>
                  </div>
                  {isWorkoutFinished && (
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-emerald-600 font-bold text-xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Treino Concluído
                    </div>
                  )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: FiTarget, label: 'Treinos na Semana', value: '4', sub: '/5' },
                    { icon: FiDroplet, label: 'Água Hoje', value: '2.1', sub: 'L' },
                    { icon: FiActivity, label: 'Peso Atual', value: '64.5', sub: 'kg' },
                    { icon: FiTrendingUp, label: 'Evolução', value: '+2%', sub: ' MM', green: true },
                  ].map((card, i) => (
                    <div key={i} className="p-5 rounded-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                        <card.icon size={18} style={{ color: '#881337' }} />
                      </div>
                      <p className="text-[10px] uppercase font-black tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.label}</p>
                      <p className="text-2xl font-bold" style={{ color: card.green ? '#34d399' : '#ffffff' }}>
                        {card.value}<span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.sub}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Today's Workout Card */}
                <div className="bg-wine-950 rounded-[2.5rem] p-8 text-white shadow-wine relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-soft/20 blur-3xl rounded-full" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 ${isWorkoutFinished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10'}`}>
                      {isWorkoutFinished ? 'Meta Batida' : 'Treino do Dia'}
                    </span>
                    <h2 className="text-3xl font-serif italic mb-2">
                      {isWorkoutFinished ? 'Treino Diário Concluído!' : (activeWorkout ? activeWorkout.titulo : 'Sem Treino Ativo')}
                    </h2>
                    <p className="text-white/60 text-sm mb-6 max-w-md">
                      {isWorkoutFinished 
                        ? 'Parabéns! Você finalizou todos os exercícios programados para hoje. Descanse bem e mantenha o foco!' 
                        : (activeWorkout ? activeWorkout.descricao : 'Sua personal ainda não gerou seu ciclo de treinos personalizado.')}
                    </p>
                    {!isWorkoutFinished && activeWorkout && (
                      <button onClick={() => setActiveTab('workout')} className="btn-premium bg-white text-wine-950 px-8 py-3 w-fit text-sm">
                        Iniciar Treino
                      </button>
                    )}
                    {isWorkoutFinished && (
                       <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                         <FiCheckCircle /> Progresso de hoje: 100%
                       </div>
                    )}
                  </div>
                    {/* Abstract visual */}
                    <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-pulse ${isWorkoutFinished ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-gradient-to-tr from-bordeaux to-rose-soft'}`}>
                        {isWorkoutFinished ? <FiCheck size={40} /> : <FiVideo size={32} />}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'workout' && (
              <motion.div
                key="workout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: '#881337' }}>Planejamento Completo</p>
                  <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-6">Meu Treino</h1>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {activeWorkout?.conteudo_treino?.workouts ? activeWorkout.conteudo_treino.workouts.map((w, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-wine-950 rounded-[2.5rem] p-8 md:p-10 text-white shadow-wine relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-rose-soft/90 uppercase tracking-wider">{w.title}</h3>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                            <FiTarget size={14} className="text-rose-soft" />
                          </div>
                        </div>
                        
                        <div className="h-px w-full bg-white/10 mb-8" />
                        
                        <div className="space-y-6">
                          {w.exercises.map((ex, i) => (
                            <div key={i} className="flex items-start gap-4 group/ex">
                              <div className="w-2 h-2 rounded-full bg-rose-soft mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,170,170,0.5)]" />
                              <div>
                                <p className="text-sm font-medium text-white/90 leading-tight mb-1">
                                  {ex.exercise} <span className="text-rose-soft/70 ml-1">({ex.sets})</span>
                                </p>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{ex.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )) : activeWorkout?.conteudo_treino?.exercises ? (
                    <div className="col-span-full space-y-4">
                      {activeWorkout.conteudo_treino.exercises.map((ex, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-wine-50 shadow-premium flex flex-col md:flex-row md:items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-wine-50 flex items-center justify-center shrink-0 overflow-hidden text-wine-950">
                             <FiActivity size={24} />
                           </div>
                           <div className="flex-1">
                             <h4 className="font-bold text-lg text-wine-950 mb-1">{ex.exercise || ex.name}</h4>
                             <p className="text-xs text-wine-900/60 mb-3">{ex.detail}</p>
                             <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-bordeaux">
                               <span className="flex items-center gap-1 bg-wine-50 px-3 py-1 rounded-lg border border-wine-100">{ex.sets}</span>
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-wine-200">
                      <FiTarget className="w-12 h-12 text-wine-100 mx-auto mb-4" />
                      <p className="text-wine-900/40 font-medium">Nenhum exercício listado para este ciclo.</p>
                    </div>
                  )}
                </div>
              </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Header */}
                <div>
                  <p className="text-[10px] text-bordeaux font-black uppercase tracking-[0.3em] mb-2">Conta</p>
                  <h1 className="text-4xl md:text-5xl font-serif italic text-wine-950">Meu Perfil</h1>
                </div>

                {/* Avatar + Identity */}
                <div className="bg-wine-950 rounded-[2.5rem] p-8 md:p-10 text-white shadow-wine relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-bordeaux/10 blur-3xl rounded-full pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative shrink-0">
                      <img
                        src={userDisplay.avatar}
                        alt={userDisplay.name}
                        className="w-28 h-28 rounded-[2rem] border-4 border-bordeaux/40 shadow-2xl object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-wine-950 shadow-lg" />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold text-white mb-1">{userDisplay.name}</h2>
                      <p className="text-bordeaux font-black text-xs uppercase tracking-[0.3em] mb-4">@{userData?.usuario}</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bordeaux/20 border border-bordeaux/30">
                        <FiShield size={14} className="text-bordeaux" />
                        <span className="text-white font-black text-xs uppercase tracking-widest">{userDisplay.plan}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: FiCalendar,
                      label: 'Membro desde',
                      value: userData?.data_cadastro
                        ? new Date(userData.data_cadastro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '—',
                      accent: 'text-blue-400',
                      bg: 'bg-blue-500/10'
                    },
                    {
                      icon: FiShield,
                      label: 'Plano Ativo',
                      value: userDisplay.plan,
                      accent: 'text-bordeaux',
                      bg: 'bg-bordeaux/10'
                    },
                    {
                      icon: FiTarget,
                      label: 'Vencimento do Plano',
                      value: userData?.data_cadastro
                        ? new Date(new Date(userData.data_cadastro).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '—',
                      accent: 'text-bordeaux',
                      bg: 'bg-bordeaux/10'
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 border border-wine-50 shadow-premium">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                        <item.icon size={18} className={item.accent} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 mb-1">{item.label}</p>
                      <p className="font-bold text-wine-950 text-sm leading-tight">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-wine-100 hover:border-wine-900/20 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-wine-50 flex items-center justify-center group-hover:bg-wine-100 transition-colors">
                        <FiArrowLeft size={18} className="text-wine-900" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-wine-950">Voltar ao site</p>
                        <p className="text-[10px] text-wine-900/40 font-black uppercase tracking-widest">Página principal RM</p>
                      </div>
                    </div>
                    <FiTarget size={16} className="text-wine-900/20 group-hover:text-wine-900/60 transition-colors" />
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem('rm_user')
                      navigate('/login')
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <FiLogOut size={18} className="text-red-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-red-600">Sair da conta</p>
                        <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Encerrar sessão</p>
                      </div>
                    </div>
                    <FiTarget size={16} className="text-red-300 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}


            {(activeTab === 'evolution' || activeTab === 'chat') && (
              <motion.div
                key="other"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-wine-50 text-wine-900 flex items-center justify-center text-4xl mb-6">
                  {activeTab === 'evolution' && <FiTrendingUp />}
                  {activeTab === 'chat' && <FiMessageCircle />}
                </div>
                <h2 className="heading-md text-wine-950 mb-4 capitalize">Em construção</h2>
                <p className="text-wine-900/60 max-w-md">Esta área do portal premium está sendo personalizada para sua conta.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-wine-950/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-64 bg-white h-full p-6 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-8 w-auto" />
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-wine-950 p-2"><FiX size={24} /></button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === item.id 
                        ? 'bg-wine-50 text-wine-900 font-bold' 
                        : 'text-wine-900/60 hover:bg-wine-50/50 hover:text-wine-900 font-medium'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardPage
