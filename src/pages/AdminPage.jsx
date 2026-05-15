import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiHome, FiUsers, FiTarget, FiDollarSign, FiBarChart2,
  FiBell, FiMenu, FiX, FiPlus,
  FiSearch, FiTrendingUp, FiActivity,
  FiEdit, FiTrash2, FiCheckCircle, FiChevronRight, FiArrowLeft, FiSun, FiMoon, FiAlertCircle
} from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const adminLinks = [
  { icon: FiHome, label: 'Dashboard', id: 'dashboard' },
  { icon: FiUsers, label: 'Gestão de Alunas', id: 'students' },
  { icon: FiTarget, label: 'Planilhas de Treino', id: 'workouts' },
  { icon: FiBarChart2, label: 'Evolução Global', id: 'analytics' },
  { icon: FiDollarSign, label: 'Financeiro', id: 'finance' },
  { icon: FiBell, label: 'Notificações', id: 'notifications' },
]



const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [generatedUser, setGeneratedUser] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [newUserPlan, setNewUserPlan] = useState('Premium')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [studentsData, setStudentsData] = useState([])
  const [stats, setStats] = useState({
    activeStudents: 0,
    monthlyRevenue: 0,
    workoutsGenerated: 0,
    retentionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null })
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  
  // Workout Generation State
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [workoutType, setWorkoutType] = useState('Hipertrofia')
  const [isGenerating, setIsGenerating] = useState(false)
  const [workoutsList, setWorkoutsList] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
    fetchWorkouts()

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios' },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'planilhas_treino' },
        () => fetchWorkouts()
      )
      .subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('planilhas_treino')
        .select(`
          *,
          usuarios (usuario)
        `)
        .order('data_criacao', { ascending: false })
      
      if (error) throw error
      setWorkoutsList(data || [])
    } catch (err) {
      console.error("Error fetching workouts:", err)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 4000);
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch Students
      const { data: users, error } = await supabase
        .from('usuarios')
        .select('*')

      if (error) {
        showNotification(`Erro ao buscar dados: ${error.message}`, 'error');
        throw error;
      }

      if (users) {
        console.log("Usuários encontrados:", users.length);
        setStudentsData(users.map(u => ({
          id: u.id,
          name: u.usuario || 'Usuário Sem Nome',
          plano: u.plano || 'Premium',
          status: u.status || 'Ativo', 
          objective: u.objetivo || 'Aguardando Avaliação',
          lastCheck: new Date(u.data_cadastro).toLocaleDateString('pt-BR')
        })))

        // Calculate basic stats
        setStats({
          activeStudents: users.length,
          monthlyRevenue: users.length * 99, // Hypothetical price per plan
          workoutsGenerated: users.length * 4,
          retentionRate: 100
        })
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setConfirmModal({
      show: true,
      title: 'Resetar Sistema',
      message: 'Tem certeza que deseja resetar todas as alunas? Isso apagará TODOS os registros.',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('usuarios').delete().eq('role', 'aluna')
          if (error) throw error
          await fetchData() // Refresh data after reset
          setConfirmModal(prev => ({ ...prev, show: false }))
          showNotification('Sistema resetado com sucesso.');
        } catch (err) {
          console.error("Erro ao resetar:", err)
          setConfirmModal(prev => ({ ...prev, show: false }))
          showNotification('Erro ao resetar: ' + err.message, 'error')
        }
      }
    })
  }

  const [editingUser, setEditingUser] = useState(null)

  const handleDeleteStudent = async (username) => {
    if (username === 'admin') {
      showNotification('O usuário administrador não pode ser excluído.', 'error');
      return;
    }
    setConfirmModal({
      show: true,
      title: 'Remover Aluna',
      message: `Tem certeza que deseja remover o acesso de "${username}"?`,
      onConfirm: async () => {
        try {
          console.log("Tentando excluir usuário:", username)
          const { error } = await supabase.from('usuarios').delete().eq('usuario', username)
          
          if (error) {
            console.error("Erro retornado pelo Supabase:", error)
            throw error
          }
          
          // Re-fetch to ensure UI is updated immediately
          await fetchData()
          
          setConfirmModal(prev => ({ ...prev, show: false }))
          showNotification(`Acesso de "${username}" removido.`);
        } catch (err) {
          console.error("Erro capturado ao excluir:", err)
          setConfirmModal(prev => ({ ...prev, show: false }))
          showNotification(`Erro ao excluir: ${err.message}`, 'error');
        }
      }
    })
  }

  const handleEditStudent = (student) => {
    setGeneratedUser(student.name)
    setGeneratedPassword('')
    setNewUserPlan(student.plano)
    setEditingUser(student.name)
    setIsCreatingUser(true)
  }

  const handleGenerateWorkout = async () => {
    if (!selectedStudentId) {
      showNotification('Selecione uma aluna primeiro.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulating AI Intelligence for Workout Generation
      // In a real app, this could call an OpenAI API or a specialized microservice
      const exercisesByFoco = {
        'Hipertrofia': [
          { name: 'Agachamento Livre', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Leg Press 45', sets: '4', reps: '12-15', rest: '60s' },
          { name: 'Stiff c/ Halteres', sets: '4', reps: '12', rest: '60s' },
          { name: 'Cadeira Extensora', sets: '3', reps: 'Falha', rest: '45s' },
        ],
        'Emagrecimento': [
          { name: 'Burpees', sets: '4', reps: '15', rest: '30s' },
          { name: 'Agachamento Salto', sets: '4', reps: '20', rest: '30s' },
          { name: 'Escalador', sets: '4', reps: '45s', rest: '30s' },
          { name: 'Prancha Abdominal', sets: '3', reps: '60s', rest: '30s' },
        ],
        'Glúteos & Core': [
          { name: 'Elevação Pélvica', sets: '4', reps: '15', rest: '60s' },
          { name: 'Abdução de Quadril', sets: '4', reps: '20', rest: '45s' },
          { name: 'Glúteo no Cabo', sets: '3', reps: '12-15', rest: '45s' },
          { name: 'Dead Bug', sets: '3', reps: '15', rest: '30s' },
        ]
      };

      const selectedExercises = exercisesByFoco[workoutType] || exercisesByFoco['Hipertrofia'];
      
      const { error } = await supabase.from('planilhas_treino').insert({
        aluna_id: selectedStudentId,
        titulo: `Ciclo: ${workoutType} RM`,
        foco: workoutType,
        conteudo_treino: { exercises: selectedExercises },
        descricao: `Treino gerado por IA para foco em ${workoutType}.`
      });

      if (error) throw error;
      
      await fetchWorkouts();
      setShowWorkoutModal(false);
      showNotification('Treino gerado com sucesso!');
    } catch (err) {
      console.error("Error generating workout:", err);
      showNotification('Erro ao gerar treino: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  }


  return (
    <div className={`fixed inset-0 w-full h-full flex overflow-hidden z-[100] transition-colors duration-500 ${isDarkMode ? 'bg-wine-950 text-white' : 'bg-premium-light text-wine-950'}`}>
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img src="/img/ray-logo.png" alt="Logo" className="h-24 w-auto grayscale" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Image Overlay */}
      <div className={`absolute inset-0 mix-blend-overlay z-0 pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}>
        <img 
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-t from-wine-950 via-transparent to-wine-950/80' : 'bg-gradient-to-t from-premium-light via-transparent to-premium-light/50'}`} />

      {/* Sidebar - Admin Hub */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 backdrop-blur-3xl border-r transform transition-all duration-500 ease-[0.22, 1, 0.36, 1] ${
        isDarkMode 
          ? 'bg-wine-950/80 border-white/5 shadow-2xl' 
          : 'bg-white/80 border-wine-100 shadow-xl'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${!sidebarOpen ? 'invisible lg:visible' : 'visible'}`}>
        <div className="p-8 flex flex-col h-full relative z-10">
          <div className="mb-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center">
                <span className="text-white font-display font-black text-xl">RM</span>
              </div>
              <div>
                <span className={`font-display font-black text-base ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>RAYANA</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-bordeaux font-black">Admin Hub</span>
              </div>
            </Link>
          </div>

          <nav className="space-y-2 flex-1">
            {adminLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => { setActiveTab(link.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 ${
                  activeTab === link.id
                    ? (isDarkMode ? 'bg-bordeaux/20 text-white border border-bordeaux/30' : 'bg-wine-50 text-wine-900 border border-wine-100')
                    : (isDarkMode ? 'text-white/40 hover:text-white hover:bg-white/[0.03]' : 'text-wine-900/60 hover:text-wine-900 hover:bg-wine-50/50')
                }`}
              >
                <link.icon className={`w-5 h-5 ${activeTab === link.id ? 'text-bordeaux' : ''}`} />
                {link.label}
              </button>
            ))}
          </nav>

          <button onClick={() => navigate('/')} className={`mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-colors ${isDarkMode ? 'text-white/30 hover:text-white' : 'text-wine-900/40 hover:text-wine-900'}`}>
            <FiArrowLeft className="w-5 h-5" /> Voltar para o site
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto relative z-10">
        {/* Header */}
        <header className={`px-8 py-6 backdrop-blur-3xl border-b flex items-center justify-between z-40 sticky top-0 transition-colors duration-500 ${isDarkMode ? 'bg-wine-950/50 border-white/5' : 'bg-white/50 border-wine-100'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden ${isDarkMode ? 'text-white/50' : 'text-wine-900/50'}`}><FiMenu className="w-6 h-6" /></button>
            <h1 className={`font-display font-black text-xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Painel de Gestão</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-wine-50 text-wine-900 hover:bg-wine-100'}`}
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            
             
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-colors ${isDarkMode ? 'bg-white/5 text-white/40' : 'bg-wine-50 text-wine-900/40'}`}>
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-bordeaux text-[9px] text-white flex items-center justify-center font-black">5</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Tab Contents */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: FiUsers, label: 'Alunas Ativas', value: stats.activeStudents, change: '+0%', color: 'text-wine-800', bg: 'bg-wine-800/10' },
                  { icon: FiDollarSign, label: 'Receita Mensal', value: `R$ ${stats.monthlyRevenue}`, change: '+0%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { icon: FiActivity, label: 'Treinos Gerados', value: stats.workoutsGenerated, change: '+0', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { icon: FiTrendingUp, label: 'Taxa Retenção', value: `${stats.retentionRate}%`, change: '+0%', color: 'text-bordeaux', bg: 'bg-bordeaux/10' },
                ].map((s, i) => (
                  <div key={i} className={`backdrop-blur-xl rounded-[32px] p-6 border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-50'}`}>
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>{s.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className={`font-display font-black text-3xl ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{s.value}</p>
                      <span className={`text-[10px] font-black ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Student Activity */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className={`font-display font-black text-lg uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Atividade das Alunas</h2>
                    <button onClick={() => setActiveTab('students')} className="text-bordeaux text-xs font-black uppercase tracking-widest">Ver Tudo</button>
                  </div>
                  
                  <div className={`backdrop-blur-xl rounded-[32px] overflow-hidden border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-50'}`}>
                    <div className="space-y-1">
                      {studentsData.length > 0 ? studentsData.map((s, i) => (
                        <div key={i} className={`flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-wine-50'}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center text-white font-black">{s.name[0]}</div>
                            <div>
                              <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{s.name}</p>
                              <p className={`text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-white/30' : 'text-wine-900/30'}`}>{s.objective}</p>
                            </div>
                          </div>
                          <div className="hidden md:block">
                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/30' : 'text-wine-900/30'}`}>Status</p>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border ${
                              s.status === 'Ativo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                              s.status === 'Atrasado' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>{s.status}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/30' : 'text-wine-900/30'}`}>Cadastro</p>
                            <p className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{s.lastCheck}</p>
                          </div>
                          <button className={`p-2 transition-colors ${isDarkMode ? 'text-white/20 hover:text-white' : 'text-wine-900/20 hover:text-wine-900'}`}><FiChevronRight /></button>
                        </div>
                      )) : (
                        <div className="p-12 text-center">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Nenhuma atividade recente.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions / Plans */}
                <div className="space-y-8">
                  <h2 className={`font-display font-black text-lg uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Ações Rápidas</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => { setCreateError(null); setIsCreatingUser(true); }}
                      className={`flex items-center gap-4 p-5 rounded-3xl backdrop-blur-xl border transition-all group text-left shadow-2xl ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-wine-900/40' : 'bg-white border-wine-50 hover:bg-wine-50 hover:border-wine-200'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-wine-900/20 flex items-center justify-center group-hover:bg-wine-900/40 transition-all">
                        <FiPlus className="w-6 h-6 text-wine-800" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Gerar Acesso</p>
                        <p className={isDarkMode ? 'text-white/30 text-[10px]' : 'text-wine-900/40 text-[10px]'}>Criar usuário e senha</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setShowWorkoutModal(true); setSelectedStudentId(''); }}
                      className={`flex items-center gap-4 p-5 rounded-3xl backdrop-blur-xl border transition-all group text-left shadow-2xl ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-bordeaux/40' : 'bg-white border-wine-50 hover:bg-wine-50 hover:border-wine-200'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-bordeaux/10 flex items-center justify-center group-hover:bg-bordeaux/20 transition-all">
                        <FiTarget className="w-6 h-6 text-bordeaux" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Gerar Planilha</p>
                        <p className={isDarkMode ? 'text-white/30 text-[10px]' : 'text-wine-900/40 text-[10px]'}>Lançar novo ciclo</p>
                      </div>
                    </button>
                  </div>

                  <div className={`backdrop-blur-xl rounded-[32px] p-8 border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-50'}`}>
                    <h3 className={`font-display font-black text-xs uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Planos Ativos</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Essencial', val: studentsData.filter(s => s.plano === 'Essencial').length, color: 'bg-white/20' },
                        { label: 'Premium', val: studentsData.filter(s => s.plano === 'Premium').length, color: 'bg-wine-800' },
                        { label: 'VIP Elite', val: studentsData.filter(s => s.plano === 'VIP Elite').length, color: 'bg-bordeaux' },
                      ].map((p, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className={isDarkMode ? 'text-white/40' : 'text-wine-900/40'}>{p.label}</span>
                            <span className={isDarkMode ? 'text-white' : 'text-wine-950'}>{p.val}</span>
                          </div>
                          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-wine-50'}`}>
                            <div className={`h-full ${p.color}`} style={{ width: `${studentsData.length > 0 ? (p.val / studentsData.length) * 100 : 0}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`font-display font-black text-3xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Gestão de Alunas</h2>
                  <p className={isDarkMode ? 'text-white/40 text-sm' : 'text-wine-900/40 text-sm'}>Gerencie todos os acessos e perfis ativos.</p>
                </div>
                <button onClick={() => setIsCreatingUser(true)} className="px-6 py-3 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl">Nova Aluna</button>
              </div>

              <div className={`backdrop-blur-xl rounded-[32px] overflow-hidden border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-50'}`}>
                <div className="p-6 border-b border-wine-50 flex items-center gap-4">
                  <FiSearch className="text-wine-900/40" />
                  <input type="text" placeholder="Buscar por nome ou plano..." className="bg-transparent border-none outline-none flex-1 text-sm font-bold" />
                </div>
                
                {/* Responsive Header (Desktop Only) */}
                <div className={`hidden md:grid md:grid-cols-4 p-6 text-[10px] font-black uppercase tracking-widest border-b ${isDarkMode ? 'text-white/40 border-white/5' : 'text-wine-900/40 border-wine-50'}`}>
                  <div>Aluna</div>
                  <div>Plano</div>
                  <div>Status</div>
                  <div className="text-right">Ações</div>
                </div>

                <div className="divide-y divide-wine-50/10">
                  {studentsData.map((s, i) => (
                    <div key={i} className={`grid grid-cols-1 md:grid-cols-4 items-center p-6 gap-4 md:gap-0 hover:bg-white/[0.02] transition-colors ${isDarkMode ? 'border-white/5' : 'border-wine-50'}`}>
                      {/* Aluna Name */}
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center text-white font-black text-xs shadow-lg">{s.name[0]}</div>
                        <div>
                          <span className="font-bold text-sm block">{s.name}</span>
                          <span className="md:hidden text-[9px] font-black uppercase tracking-widest opacity-40">{s.plano}</span>
                        </div>
                      </div>

                      {/* Plano (Desktop Only) */}
                      <div className="hidden md:block text-sm font-bold opacity-80">{s.plano}</div>

                      {/* Status */}
                      <div className="flex md:block items-center justify-between">
                        <span className="md:hidden text-[10px] font-black uppercase tracking-widest opacity-30">Status</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">Ativo</span>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-wine-50/10">
                        <button 
                          onClick={() => handleEditStudent(s)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-wine-50 text-wine-900 hover:bg-wine-100'}`}
                        >
                          <FiEdit size={14} />
                          <span className="md:hidden lg:inline">Editar</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(s.name)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                        >
                          <FiTrash2 size={14} />
                          <span className="md:hidden lg:inline">Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'workouts' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`font-display font-black text-3xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Planilhas de Treino</h2>
                  <p className={isDarkMode ? 'text-white/40 text-sm' : 'text-wine-900/40 text-sm'}>Histórico de treinos gerados por IA.</p>
                </div>
                <button 
                  onClick={() => setShowWorkoutModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl"
                >
                  Novo Treino IA
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workoutsList.length > 0 ? workoutsList.map((w, i) => (
                  <div key={i} className={`p-8 rounded-[32px] border transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-bordeaux/40' : 'bg-white border-wine-50 hover:border-wine-900/40'}`}>
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wine-900 to-bordeaux flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                        <FiTarget size={24} />
                      </div>
                      <h3 className="font-display font-black text-lg mb-1">{w.titulo}</h3>
                      <p className={`text-[10px] font-black uppercase text-bordeaux mb-4`}>Aluna: {w.usuarios?.usuario || 'Desconhecida'}</p>
                      <p className={`text-xs mb-6 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Foco: {w.foco} • {new Date(w.data_criacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedWorkout(w)}
                      className="w-full py-3 rounded-xl border border-wine-900/20 text-wine-900 text-[10px] font-black uppercase tracking-widest hover:bg-wine-900 hover:text-white transition-all"
                    >
                      Visualizar Treino
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full p-12 text-center">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Nenhum treino gerado ainda.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className={`font-display font-black text-3xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Evolução Global</h2>
              <div className={`p-12 rounded-[40px] border flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-100 shadow-2xl'}`}>
                <div className="w-20 h-20 rounded-full bg-wine-900/10 flex items-center justify-center text-wine-900 mb-6">
                  <FiBarChart2 size={40} />
                </div>
                <h3 className="text-xl font-black mb-2">Relatórios em Processamento</h3>
                <p className="text-sm opacity-60 max-w-md">Os dados de evolução das alunas são processados mensalmente. Próxima atualização em 5 dias.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'finance' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className={`font-display font-black text-3xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Financeiro</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-2 p-10 rounded-[40px] border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-100 shadow-2xl'}`}>
                  <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Receita Anual</p>
                  <h3 className="text-4xl font-display font-black mb-10">R$ {stats.monthlyRevenue * 12}</h3>
                  <div className="h-64 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 80, 100, 85, 95, 60, 75, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-wine-950 to-bordeaux rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-100 shadow-2xl'}`}>
                  <h4 className="font-black text-sm uppercase mb-6">Vencimentos Próximos</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-wine-50/50">
                        <span className="text-xs font-bold">Aluna #00{i}</span>
                        <span className="text-[10px] font-black text-amber-600">PENDENTE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className={`font-display font-black text-3xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Notificações</h2>
              <div className="space-y-4">
                {[
                  { title: 'Novo Cadastro', desc: 'Ana Silva acabou de ativar o plano Premium.', time: '10 min atrás', type: 'success' },
                  { title: 'Check-in Realizado', desc: 'Carla Santos completou o treino de Glúteos.', time: '1 hora atrás', type: 'info' },
                  { title: 'Pendência de Pagamento', desc: 'O plano de Beatriz R. expira em 2 dias.', time: '5 horas atrás', type: 'warning' },
                ].map((n, i) => (
                  <div key={i} className={`p-6 rounded-3xl border flex items-center justify-between transition-all hover:bg-wine-50/20 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-wine-50 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                      <div>
                        <h4 className="font-bold text-sm">{n.title}</h4>
                        <p className="text-xs opacity-60">{n.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black opacity-30">{n.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      {/* User Creation Form Modal */}
      <AnimatePresence>
        {isCreatingUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border ${isDarkMode ? 'bg-wine-950 border-white/10' : 'bg-white border-wine-100'}`}
            >
              <button onClick={() => setIsCreatingUser(false)} className={`absolute top-6 right-6 transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-wine-900/40 hover:text-wine-900'}`}><FiX size={24} /></button>
              
              <h2 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Gerar Novo Acesso</h2>
              <p className={`text-sm mb-8 font-medium ${isDarkMode ? 'text-white/60' : 'text-wine-900/60'}`}>Preencha os dados da aluna para criar o login.</p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (editingUser) {
                    // Update existing
                    const { error } = await supabase
                      .from('usuarios')
                      .update({
                        usuario: generatedUser,
                        senha: generatedPassword || undefined, // Only update password if provided
                        plano: newUserPlan
                      })
                      .eq('usuario', editingUser)
                    
                    if (error) throw error
                  } else {
                    // Insert new
                    const { error } = await supabase.from('usuarios').insert({
                      usuario: generatedUser,
                      senha: generatedPassword,
                      role: newUserPlan === 'Administrador' ? 'admin' : 'aluna',
                      plano: newUserPlan
                    });
                    
                    if (error) {
                      if (error.message.includes('unique constraint')) {
                        setCreateError('Este nome de usuário já está sendo usado. Por favor, escolha outro.');
                      } else {
                        setCreateError(`Erro ao salvar: ${error.message}`);
                      }
                      return;
                    }
                  }

                  await fetchData();
                  setEditingUser(null);
                  setTimeout(() => {
                    setIsCreatingUser(false);
                    if (!editingUser) setShowNewUserModal(true);
                  }, 500);

                } catch (err) {
                  console.error("Erro ao salvar:", err);
                  setCreateError(`Atenção: Não foi possível salvar no banco de dados (${err.message || 'Erro Desconhecido'}).`);
                }
              }} className="space-y-6">
                {createError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                  >
                    <FiAlertCircle className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-500 font-bold">{createError}</p>
                  </motion.div>
                )}
                <div>

                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Nome de Usuário</label>
                  <input 
                    type="text" 
                    value={generatedUser}
                    onChange={(e) => setGeneratedUser(e.target.value)}
                    placeholder="ex: ana_paula"
                    required
                    className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Senha de Acesso</label>
                  <input 
                    type="text" 
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    placeholder="ex: ray123"
                    required
                    className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Plano da Aluna</label>
                  <select 
                    value={newUserPlan}
                    onChange={(e) => setNewUserPlan(e.target.value)}
                    className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                  >
                    <option value="Essencial">Essencial</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP Elite">VIP Elite</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-5 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-wine transition-all mt-4">
                  Confirmar e Criar Acesso
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showNewUserModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border ${isDarkMode ? 'bg-wine-950 border-white/10' : 'bg-white border-wine-100'}`}
            >
              <button 
                onClick={() => { setShowNewUserModal(false); setCreateError(null); }}
                className={`p-2 rounded-xl transition-colors absolute top-6 right-6 ${isDarkMode ? 'hover:bg-white/5 text-white/40' : 'hover:bg-wine-50 text-wine-900/40'}`}
              >
                <FiX size={24} />
              </button>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 mx-auto">
                <FiCheckCircle size={32} />
              </div>
              <h2 className={`text-2xl font-black uppercase tracking-tighter text-center mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Acesso Criado!</h2>
              <p className={`text-sm text-center mb-8 font-medium ${isDarkMode ? 'text-white/60' : 'text-wine-900/60'}`}>Credenciais salvas com sucesso. Envie para a aluna.</p>
              
              <div className="space-y-4 mb-8">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-wine-50 border-wine-100'}`}>
                  <p className="text-[10px] font-black uppercase text-wine-800 tracking-[0.1em] mb-1">Usuário / Plano</p>
                  <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{generatedUser} - <span className="text-bordeaux">{newUserPlan}</span></p>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-wine-50 border-wine-100'}`}>
                  <p className="text-[10px] font-black uppercase text-bordeaux tracking-[0.1em] mb-1">Senha</p>
                  <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{generatedPassword}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Seu acesso ao Portal Rayana Maria\nPlano: ${newUserPlan}\nUsuário: ${generatedUser}\nSenha: ${generatedPassword}`);
                  setShowNewUserModal(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                Copiar e Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Workout Generation Modal */}
      <AnimatePresence>
        {showWorkoutModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border ${isDarkMode ? 'bg-wine-950 border-white/10' : 'bg-white border-wine-100'}`}
            >
              <button onClick={() => setShowWorkoutModal(false)} className={`absolute top-6 right-6 transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-wine-900/40 hover:text-wine-900'}`}><FiX size={24} /></button>
              
              <h2 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Gerar Treino IA</h2>
              <p className={`text-sm mb-8 font-medium ${isDarkMode ? 'text-white/60' : 'text-wine-900/60'}`}>A IA criará uma planilha personalizada para a aluna.</p>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Selecionar Aluna</label>
                  <select 
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                  >
                    <option value="">Selecione uma aluna...</option>
                    {studentsData.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.plano})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Foco do Treino</label>
                  <select 
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                  >
                    <option value="Hipertrofia">Hipertrofia (Massa Magra)</option>
                    <option value="Emagrecimento">Emagrecimento (Cardio/HIT)</option>
                    <option value="Glúteos & Core">Foco em Glúteos & Core</option>
                    <option value="Condicionamento">Condicionamento Físico</option>
                  </select>
                </div>

                <div className={`p-6 rounded-3xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-wine-50 border-wine-100'}`}>
                  <FiActivity className="w-8 h-8 text-bordeaux mx-auto mb-3" />
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>IA RM v2.0 Ativa</p>
                  <p className="text-xs mt-2 italic font-medium opacity-60">"Ajustando cargas e descansos com base no perfil da aluna."</p>
                </div>

                <button 
                  onClick={handleGenerateWorkout}
                  disabled={isGenerating || !selectedStudentId}
                  className="w-full py-5 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-wine transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <><FiRefreshCw className="animate-spin" /> Processando IA...</>
                  ) : 'Gerar Planilha de Treino'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* View Workout Details Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative border max-h-[85vh] overflow-y-auto ${isDarkMode ? 'bg-wine-950 border-white/10' : 'bg-white border-wine-100'}`}
            >
              <button onClick={() => setSelectedWorkout(null)} className={`absolute top-6 right-6 transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-wine-900/40 hover:text-wine-900'}`}><FiX size={24} /></button>
              
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-bordeaux/10 text-bordeaux rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-bordeaux/20">Detalhamento IA</span>
                <h2 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{selectedWorkout.titulo}</h2>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>
                  Para: <span className="text-bordeaux font-bold">{selectedWorkout.usuarios?.usuario}</span> • Foco: <span className="font-bold">{selectedWorkout.foco}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                {selectedWorkout.conteudo_treino?.exercises ? selectedWorkout.conteudo_treino.exercises.map((ex, i) => (
                  <div key={i} className={`p-5 rounded-3xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-wine-50/50 border-wine-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-wine-900/20 flex items-center justify-center text-wine-900 font-black">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{ex.name}</h4>
                        <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">{ex.sets} séries • {ex.reps} reps</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black opacity-30 uppercase">Pausa</p>
                      <p className="font-bold text-xs">{ex.rest}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-10 opacity-40">Nenhum exercício cadastrado.</p>
                )}
              </div>

              <button 
                onClick={() => setSelectedWorkout(null)}
                className="w-full py-4 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-wine transition-all"
              >
                Fechar Visualização
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-xl border ${
              notification.type === 'success' 
                ? 'bg-emerald-500/90 text-white border-emerald-400/20' 
                : 'bg-red-500/90 text-white border-red-400/20'
            }`}
          >
            {notification.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
            <p className="font-bold text-sm">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPage
