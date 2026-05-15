import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiHome, FiActivity, FiMessageCircle, 
  FiMenu, FiX, FiDroplet, FiTarget, FiArrowLeft, FiCheck, FiCheckCircle
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
    if (activeWorkout && completedExercises.length > 0 && completedExercises.length === activeWorkout.conteudo_treino?.exercises?.length) {
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
  }, [completedExercises, activeWorkout, userData, isWorkoutFinished])

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
    { id: 'settings', icon: FiSettings, label: 'Configurações' },
  ]

  return (
    <div className="min-h-screen bg-premium-light flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-wine-100 p-6 fixed h-full z-20">
        {/* Logo */}
        <Link to="/" className="flex items-center mb-12">
          <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-12 w-auto" />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-wine-100 mt-auto space-y-1">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-wine-900/60 hover:text-wine-900 hover:bg-wine-50/50 transition-all text-sm font-bold"
          >
            <div className="w-8 h-8 rounded-lg bg-wine-50 flex items-center justify-center">
              <FiArrowLeft size={16} />
            </div>
            Voltar para o site
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('rm_user')
              navigate('/login')
            }} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-wine-900/60 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-bold"
          >
            <div className="w-8 h-8 rounded-lg bg-wine-50 group-hover:bg-red-100 flex items-center justify-center">
              <FiLogOut size={16} />
            </div>
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 relative min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end p-6 bg-white/50 backdrop-blur-md border-b border-wine-100 sticky top-0 z-30">
          <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-white border border-wine-50 shadow-sm">
            <div className="text-right">
              <p className="text-sm font-bold text-wine-950 leading-none mb-1">{userDisplay.name}</p>
              <p className="text-[10px] text-bordeaux font-black uppercase tracking-widest">{userDisplay.plan}</p>
            </div>
            <img src={userDisplay.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-wine-100 shadow-inner" />
          </div>
        </header>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-wine-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <Link to="/" className="flex items-center">
            <img src="/img/ray-logo.png" alt="Rayana Maria" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
             <img src={userDisplay.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-wine-100" />
             <button onClick={() => setIsSidebarOpen(true)} className="text-wine-950 p-2">
               <FiMenu size={24} />
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
                    <h1 className="heading-md text-wine-950 mb-2">Olá, {userDisplay.name.split(' ')[0]} 👋</h1>
                    <p className="text-wine-900/60">{isWorkoutFinished ? 'Missão cumprida por hoje! Aproveite seu descanso.' : 'Pronta para o treino de hoje? Vamos juntas.'}</p>
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
                  <div className="bg-white p-5 rounded-3xl border border-wine-50 shadow-premium">
                    <div className="w-10 h-10 rounded-xl bg-wine-50 flex items-center justify-center text-wine-900 mb-3"><FiTarget size={20} /></div>
                    <p className="text-wine-900/40 text-[10px] uppercase font-bold tracking-widest mb-1">Treinos na Semana</p>
                    <p className="text-2xl font-bold text-wine-950">4<span className="text-sm text-wine-900/40">/5</span></p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-wine-50 shadow-premium">
                    <div className="w-10 h-10 rounded-xl bg-rose-light flex items-center justify-center text-rose-soft mb-3"><FiDroplet size={20} /></div>
                    <p className="text-wine-900/40 text-[10px] uppercase font-bold tracking-widest mb-1">Água Hoje</p>
                    <p className="text-2xl font-bold text-wine-950">2.1<span className="text-sm text-wine-900/40">L</span></p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-wine-50 shadow-premium">
                    <div className="w-10 h-10 rounded-xl bg-wine-50 flex items-center justify-center text-wine-900 mb-3"><FiActivity size={20} /></div>
                    <p className="text-wine-900/40 text-[10px] uppercase font-bold tracking-widest mb-1">Peso Atual</p>
                    <p className="text-2xl font-bold text-wine-950">64.5<span className="text-sm text-wine-900/40">kg</span></p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-wine-50 shadow-premium">
                    <div className="w-10 h-10 rounded-xl bg-wine-50 flex items-center justify-center text-wine-900 mb-3"><FiTrendingUp size={20} /></div>
                    <p className="text-wine-900/40 text-[10px] uppercase font-bold tracking-widest mb-1">Evolução</p>
                    <p className="text-2xl font-bold text-emerald-500">+2%<span className="text-sm text-wine-900/40"> MM</span></p>
                  </div>
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
                <div className="flex items-center justify-between mb-6">
                  <h1 className="heading-md text-wine-950">{isWorkoutFinished ? 'Treino Concluído ✅' : (activeWorkout ? activeWorkout.titulo : 'Meu Treino Atual')}</h1>
                  {isWorkoutFinished && (
                    <button 
                      onClick={() => {
                        setIsWorkoutFinished(false);
                        setCompletedExercises([]);
                        localStorage.removeItem(`finished_${userData?.id}`);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 hover:text-wine-900 transition-colors"
                    >
                      Refazer Treino
                    </button>
                  )}
                </div>
                {/* AI Plan Generation Area */}
                <div className="bg-wine-50 p-6 rounded-3xl border border-wine-100 mb-8 flex items-center justify-between">
                   <div>
                     <h3 className="font-bold text-wine-950 mb-1">IA Fitness RM</h3>
                     <p className="text-sm text-wine-900/60">
                       {activeWorkout 
                         ? `Seu treino foi atualizado em ${new Date(activeWorkout.data_criacao).toLocaleDateString('pt-BR')}.` 
                         : 'Aguardando sua personal lançar seu primeiro ciclo de treinos IA.'}
                     </p>
                   </div>
                   {activeWorkout && (
                     <button className="text-xs font-bold uppercase tracking-widest bg-wine-900 text-white px-4 py-2 rounded-xl">Detalhes</button>
                   )}
                </div>

                <div className="space-y-4">
                  {activeWorkout?.conteudo_treino?.exercises ? activeWorkout.conteudo_treino.exercises.map((ex, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-wine-50 shadow-premium flex flex-col md:flex-row md:items-center gap-6">
                       <div className="w-20 h-20 rounded-2xl bg-wine-100 flex items-center justify-center shrink-0 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop" alt="Ex" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold text-lg text-wine-950 mb-2">{ex.name}</h4>
                         <div className="flex flex-wrap gap-4 text-sm text-wine-900/60">
                           <span className="flex items-center gap-1"><FiActivity className="text-bordeaux" /> {ex.sets} séries</span>
                           <span className="flex items-center gap-1"><FiTarget className="text-bordeaux" /> {ex.reps} reps</span>
                           <span className="flex items-center gap-1"><FiDroplet className="text-bordeaux" /> Pausa: {ex.rest}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <input type="text" placeholder="Kg" className="w-16 h-12 bg-premium-light border border-wine-100 rounded-xl text-center font-bold text-wine-950 focus:outline-none focus:border-wine-900" />
                         <button 
                           onClick={() => {
                             if (completedExercises.includes(i)) {
                               setCompletedExercises(completedExercises.filter(item => item !== i))
                             } else {
                               setCompletedExercises([...completedExercises, i])
                             }
                           }}
                           className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                             completedExercises.includes(i)
                               ? 'bg-emerald-500 text-white shadow-lg scale-110'
                               : 'bg-wine-950 text-white shadow-wine hover:bg-bordeaux'
                           }`}
                         >
                           <FiCheck size={20} />
                         </button>
                       </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-wine-200">
                      <FiTarget className="w-12 h-12 text-wine-100 mx-auto mb-4" />
                      <p className="text-wine-900/40 font-medium">Nenhum exercício listado para este ciclo.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab !== 'overview' && activeTab !== 'workout' && (
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
                  {activeTab === 'settings' && <FiSettings />}
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
