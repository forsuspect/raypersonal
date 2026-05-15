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

  // Funcionalidades de Stats
  const [waterIntake, setWaterIntake] = useState(0)
  const [currentWeight, setCurrentWeight] = useState(0)

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
        const { data, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('usuario', user.usuario)
          .limit(1)

        const userFromDb = data && data.length > 0 ? data[0] : null

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

  // Load stats from localStorage when userData is available
  useEffect(() => {
    if (userData) {
      const today = new Date().toDateString()
      const savedDate = localStorage.getItem(`water_date_${userData.id}`)
      
      if (savedDate === today) {
        const savedWater = localStorage.getItem(`water_${userData.id}`)
        if (savedWater) setWaterIntake(parseFloat(savedWater))
      } else {
        setWaterIntake(0)
      }
      
      const savedWeight = localStorage.getItem(`weight_${userData.id}`)
      if (savedWeight) {
        setCurrentWeight(parseFloat(savedWeight))
      } else {
        setCurrentWeight(64.5) // default mockup weight
      }
    }
  }, [userData])

  const handleWaterClick = () => {
    const val = window.prompt('Atualize a quantidade total de água bebida hoje (em Litros):', waterIntake.toString())
    if (val !== null && !isNaN(parseFloat(val.replace(',','.')))) {
      const num = parseFloat(val.replace(',','.')).toFixed(1)
      setWaterIntake(num)
      if (userData) {
        localStorage.setItem(`water_${userData.id}`, num.toString())
        localStorage.setItem(`water_date_${userData.id}`, new Date().toDateString())
      }
    }
  }

  const handleWeightClick = () => {
    const val = window.prompt('Atualize seu peso atual (em kg):', currentWeight.toString())
    if (val !== null && !isNaN(parseFloat(val.replace(',','.')))) {
      const num = parseFloat(val.replace(',','.')).toFixed(1)
      setCurrentWeight(num)
      if (userData) {
        localStorage.setItem(`weight_${userData.id}`, num.toString())
      }
    }
  }

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

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative" style={{ backgroundColor: '#141210' }}>
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
                    { id: 'workouts', icon: FiTarget, label: 'Treinos na Semana', value: '4', sub: '/5' },
                    { id: 'water', icon: FiDroplet, label: 'Água Hoje', value: waterIntake.toString(), sub: 'L', onClick: handleWaterClick },
                    { id: 'weight', icon: FiActivity, label: 'Peso Atual', value: currentWeight.toString(), sub: 'kg', onClick: handleWeightClick },
                    { id: 'evolution', icon: FiTrendingUp, label: 'Evolução', value: '+2%', sub: ' MM', green: true },
                  ].map((card, i) => (
                    <div 
                      key={i} 
                      onClick={card.onClick}
                      className={`p-5 rounded-3xl ${card.onClick ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}`} 
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      title={card.onClick ? 'Clique para atualizar' : ''}
                    >
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
                <div className="backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-bordeaux/20 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-10 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                  <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border ${isWorkoutFinished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/80 border-white/10'}`}>
                      {isWorkoutFinished ? 'Meta Batida' : 'Treino do Dia'}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif italic mb-3 text-white">
                      {isWorkoutFinished ? 'Treino Diário Concluído!' : (activeWorkout ? activeWorkout.titulo : 'Sem Treino Ativo')}
                    </h2>
                    <p className="text-white/50 text-sm mb-6 max-w-md leading-relaxed">
                      {isWorkoutFinished 
                        ? 'Parabéns! Você finalizou todos os exercícios programados para hoje. Descanse bem e mantenha o foco!' 
                        : (activeWorkout ? activeWorkout.descricao : 'Sua personal ainda não gerou seu ciclo de treinos personalizado.')}
                    </p>
                    {!isWorkoutFinished && activeWorkout && (
                      <button onClick={() => setActiveTab('workout')} className="bg-white text-wine-950 font-bold px-8 py-3.5 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg text-sm">
                        Iniciar Treino
                      </button>
                    )}
                    {isWorkoutFinished && (
                       <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/5 w-fit px-4 py-2 rounded-xl border border-emerald-500/10">
                         <FiCheckCircle size={16} /> Progresso de hoje: 100%
                       </div>
                    )}
                  </div>
                    {/* Abstract visual */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 flex items-center justify-center">
                      <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-2 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                      <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${isWorkoutFinished ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-bordeaux shadow-bordeaux/30'}`}>
                        {isWorkoutFinished ? <FiCheck size={40} className="text-white" /> : <FiVideo size={32} className="text-white" />}
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
                  <h1 className="text-4xl md:text-5xl font-serif italic text-white">Meu Perfil</h1>
                </div>

                {/* Avatar + Identity */}
                <div className="backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
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
                      <p className="text-bordeaux font-black text-xs uppercase tracking-[0.3em]">@{userData?.usuario}</p>
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
                    <div key={i} className="rounded-[1.5rem] p-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(136,19,55,0.15)' }}>
                        <item.icon size={18} style={{ color: '#881337' }} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</p>
                      <p className="font-bold text-white text-base leading-tight">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.09)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                        <FiArrowLeft size={18} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-white">Voltar ao site</p>
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Página principal</p>
                      </div>
                    </div>
                    <FiArrowLeft size={16} className="rotate-180" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem('rm_user')
                      navigate('/login')
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group"
                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                        <FiLogOut size={18} className="text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-red-400">Sair da conta</p>
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(239,68,68,0.5)' }}>Encerrar sessão</p>
                      </div>
                    </div>
                    <FiLogOut size={16} className="text-red-400/30" />
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
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  {activeTab === 'evolution' && <FiTrendingUp style={{ color: '#881337' }} />}
                  {activeTab === 'chat' && <FiMessageCircle style={{ color: '#881337' }} />}
                </div>
                <h2 className="heading-md text-white mb-4 capitalize">Em construção</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)' }} className="max-w-md">Esta área do portal premium está sendo personalizada para sua conta.</p>
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
