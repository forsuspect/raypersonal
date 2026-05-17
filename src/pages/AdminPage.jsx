import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiHome, FiUsers, FiTarget, FiDollarSign, FiBarChart2,
  FiBell, FiMenu, FiX, FiPlus, FiRefreshCw, FiUser,
  FiSearch, FiTrendingUp, FiActivity,
  FiEdit, FiTrash2, FiCheckCircle, FiChevronRight, FiArrowLeft, FiAlertCircle, FiLogOut, FiLock, FiUnlock, FiShield
} from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const adminLinks = [
  { icon: FiHome, label: 'Painel Geral', id: 'dashboard' },
  { icon: FiUsers, label: 'Minhas Alunas', id: 'students' },
  { icon: FiActivity, label: 'Verificar Treinos', id: 'inspect_workouts' },
  { icon: FiDollarSign, label: 'Cobranças & Planos', id: 'billing' },
  { icon: FiUser, label: 'Meu Perfil', id: 'profile' },
]



const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [generatedUser, setGeneratedUser] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [newUserPlan, setNewUserPlan] = useState('Premium')
  const [newUserStatus, setNewUserStatus] = useState('Ativo')
  const [newUserExpiration, setNewUserExpiration] = useState('')
  const [newUserContact, setNewUserContact] = useState('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isSavingUser, setIsSavingUser] = useState(false)
  const [createError, setCreateError] = useState(null)
  const isDarkMode = true // Permanent Dark Theme
  const [studentsData, setStudentsData] = useState([])
  // Detect logged-in user role for developer-only features
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('rm_user') || '{}')
      return u.role || ''
    } catch { return '' }
  })
  const isDeveloper = currentUserRole === 'desenvolvedor'
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
  const [workoutGenMode, setWorkoutGenMode] = useState('ai') // 'ai' | 'manual'
  const [activeManualDay, setActiveManualDay] = useState('SEG')
  const [manualTitle, setManualTitle] = useState('')
  const [manualFocus, setManualFocus] = useState('Hipertrofia')
  const [manualWorkouts, setManualWorkouts] = useState([
    { day: "SEG", title: "SEG: Quadríceps & Panturrilha", exercises: [{ exercise: "", sets: "", detail: "" }] },
    { day: "TER", title: "TER: Peito & Tríceps", exercises: [{ exercise: "", sets: "", detail: "" }] },
    { day: "QUA", title: "QUA: Costas & Bíceps", exercises: [{ exercise: "", sets: "", detail: "" }] },
    { day: "QUI", title: "QUI: Ombro Isolado", exercises: [{ exercise: "", sets: "", detail: "" }] },
    { day: "SEX", title: "SEX: Glúteos & Posterior", exercises: [{ exercise: "", sets: "", detail: "" }] },
    { day: "SAB", title: "SAB: Full Body", exercises: [{ exercise: "", sets: "", detail: "" }] },
    { day: "DOM", title: "DOM: Descanso Ativo", exercises: [{ exercise: "", sets: "", detail: "" }] }
  ])
  const [workoutsList, setWorkoutsList] = useState([])

  // New States for inspecting student workouts
  const [selectedInspectStudent, setSelectedInspectStudent] = useState(null)
  const [inspectDayTab, setInspectDayTab] = useState('SEG')
  const [isEditingWorkout, setIsEditingWorkout] = useState(false)
  const [editWorkoutData, setEditWorkoutData] = useState(null) // { workoutId, workouts: [...] }
  const [editDayTab, setEditDayTab] = useState('SEG')
  const [isSavingWorkout, setIsSavingWorkout] = useState(false)

  const navigate = useNavigate()

  // ── Edit workout helpers (component-level, no stale closure) ──────────
  const editUpdateExercise = (dayIdx, exIdx, field, val) => {
    setEditWorkoutData(prev => {
      if (!prev) return prev;
      const workouts = prev.workouts.map((w, i) =>
        i !== dayIdx ? w : {
          ...w,
          exercises: w.exercises.map((ex, j) =>
            j !== exIdx ? ex : { ...ex, [field]: val }
          )
        }
      );
      return { ...prev, workouts };
    });
  };

  const editAddExercise = (dayIdx) => {
    setEditWorkoutData(prev => {
      if (!prev) return prev;
      const workouts = prev.workouts.map((w, i) =>
        i !== dayIdx ? w : {
          ...w,
          exercises: [...w.exercises, { exercise: '', sets: '', detail: '' }]
        }
      );
      return { ...prev, workouts };
    });
  };

  const editRemoveExercise = (dayIdx, exIdx) => {
    setEditWorkoutData(prev => {
      if (!prev) return prev;
      const workouts = prev.workouts.map((w, i) =>
        i !== dayIdx ? w : {
          ...w,
          exercises: w.exercises.filter((_, j) => j !== exIdx)
        }
      );
      return { ...prev, workouts };
    });
  };

  const editUpdateDayTitle = (dayIdx, val) => {
    setEditWorkoutData(prev => {
      if (!prev) return prev;
      const workouts = prev.workouts.map((w, i) =>
        i !== dayIdx ? w : { ...w, title: val }
      );
      return { ...prev, workouts };
    });
  };

  const handleSaveWorkout = async () => {
    if (!editWorkoutData) return;
    setIsSavingWorkout(true);
    try {
      const { error } = await supabase
        .from('planilhas_treino')
        .update({ conteudo_treino: { workouts: editWorkoutData.workouts } })
        .eq('id', editWorkoutData.workoutId);
      if (error) throw error;
      await fetchWorkouts();
      showNotification('Planilha atualizada com sucesso!');
      setIsEditingWorkout(false);
      setEditWorkoutData(null);
    } catch (err) {
      showNotification('Erro ao salvar: ' + err.message, 'error');
    } finally {
      setIsSavingWorkout(false);
    }
  };

  useEffect(() => {
    // Dynamic matching of body background to prevent light gaps on mobile scrolling rubberbanding
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#000000';

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
      document.body.style.backgroundColor = originalBg;
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
        const storedVencimentos = JSON.parse(localStorage.getItem('rm_vencimentos') || '{}');
        const storedContatos = JSON.parse(localStorage.getItem('rm_contatos') || '{}');
        const storedStatus = JSON.parse(localStorage.getItem('rm_status') || '{}');
        setStudentsData(users.map(u => ({
          id: u.id,
          name: u.usuario || 'Usuário Sem Nome',
          plano: u.role === 'admin' || u.role === 'desenvolvedor' ? (u.role === 'desenvolvedor' ? 'Desenvolvedor' : 'Administrador') : (u.plano || 'Premium'),
          status: u.status || 'Ativo',
          objective: u.objetivo || 'Aguardando Avaliação',
          lastCheck: new Date(u.data_cadastro).toLocaleDateString('pt-BR'),
          expirationDate: u.vencimento || '',
          contact: u.contato || '',
          role: u.role || 'aluna',
          raw: u
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
    // Only block deleting 'admin' if the user is NOT a developer
    if (username === 'admin' && !isDeveloper) {
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

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'Inativo' ? 'Ativo' : 'Inativo';
    const actionText = newStatus === 'Inativo' ? 'inativar' : 'ativar';

    setConfirmModal({
      show: true,
      title: `${newStatus === 'Inativo' ? 'Inativar' : 'Ativar'} Conta`,
      message: `Tem certeza que deseja ${actionText} o acesso de ${student.name}?`,
      onConfirm: async () => {
        try {
          // Persist status directly to Supabase — survives code deploys
          const { error } = await supabase
            .from('usuarios')
            .update({ status: newStatus })
            .eq('id', student.id);
          if (error) throw error;

          await fetchData();
          setConfirmModal(prev => ({ ...prev, show: false }));
          showNotification(`${student.name} foi ${newStatus === 'Inativo' ? 'inativada' : 'ativada'} com sucesso.`);
        } catch (err) {
          console.error('Erro ao alterar status:', err);
          setConfirmModal(prev => ({ ...prev, show: false }));
          showNotification(`Erro ao alterar status: ${err.message}`, 'error');
        }
      }
    });
  }

  const handleSetRole = async (student, newRole) => {
    if (!isDeveloper) return;
    setConfirmModal({
      show: true,
      title: `Definir como ${newRole}`,
      message: `Tem certeza que deseja definir "${student.name}" como ${newRole}?`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('usuarios')
            .update({ role: newRole })
            .eq('id', student.id);
          if (error) throw error;
          await fetchData();
          setConfirmModal(prev => ({ ...prev, show: false }));
          showNotification(`${student.name} agora é ${newRole}.`);
        } catch (err) {
          setConfirmModal(prev => ({ ...prev, show: false }));
          showNotification(`Erro: ${err.message}`, 'error');
        }
      }
    });
  }

  const handleEditStudent = (student) => {
    setGeneratedUser(student.name)
    setGeneratedPassword('')
    setNewUserPlan(student.plano)
    setNewUserStatus(student.status || 'Ativo')
    setNewUserExpiration(student.expirationDate || '')
    setNewUserContact(student.contact || '')
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
      const templates = {
        'Hipertrofia': [
          { day: "SEG", title: "SEG: QUADRÍCEPS & PANTURRILHA", exercises: [{ exercise: "Cadeira Extensora", sets: "4 x 12", detail: "Foco em pico de contração" }, { exercise: "Panturrilha Sentado", sets: "4 x 12", detail: "Máxima amplitude" }, { exercise: "Leg Press 45º", sets: "4 x 12", detail: "Cadência controlada" }, { exercise: "Hack Machine", sets: "4 x 12", detail: "Foco em quadríceps" }] },
          { day: "TER", title: "TER: PEITO & TRÍCEPS", exercises: [{ exercise: "Supino Reto", sets: "4 x 10", detail: "Barra, cadência 3010" }, { exercise: "Tríceps Testa", sets: "4 x 12", detail: "Foco na excêntrica" }, { exercise: "Crucifixo Inclinado", sets: "4 x 12", detail: "Halteres" }, { exercise: "Tríceps Corda", sets: "4 x 15", detail: "Pico de contração" }] },
          { day: "QUA", title: "QUA: COSTA & BÍCEPS", exercises: [{ exercise: "Puxada Frontal", sets: "4 x 12", detail: "Pegada aberta" }, { exercise: "Remada Curvada", sets: "4 x 10", detail: "Tronco 45º" }, { exercise: "Rosca Direta", sets: "4 x 12", detail: "Barra W" }, { exercise: "Rosca Martelo", sets: "4 x 12", detail: "Halteres" }] },
          { day: "QUI", title: "QUI: OMBRO ISOLADO", exercises: [{ exercise: "Desenvolvimento", sets: "4 x 10", detail: "Halteres" }, { exercise: "Elevação Lateral", sets: "4 x 15", detail: "Cabo cruzado" }, { exercise: "Crucifixo Invertido", sets: "4 x 15", detail: "Máquina" }, { exercise: "Encolhimento", sets: "4 x 15", detail: "Halteres" }] },
          { day: "SEX", title: "SEX: GLÚTEOS & POSTERIOR", exercises: [{ exercise: "Elevação Pélvica", sets: "4 x 12", detail: "Pausa de 2s no topo" }, { exercise: "Mesa Flexora", sets: "4 x 12", detail: "Pico de contração" }, { exercise: "Stiff", sets: "4 x 12", detail: "Halteres" }, { exercise: "Cadeira Abdutora", sets: "4 x 15", detail: "Tronco inclinado" }] },
          { day: "SAB", title: "SAB: FULL BODY", exercises: [{ exercise: "Agachamento Livre", sets: "4 x 10", detail: "Amplitude total" }, { exercise: "Supino Inclinado", sets: "4 x 12", detail: "Halteres" }, { exercise: "Remada Máquina", sets: "4 x 12", detail: "Pegada neutra" }, { exercise: "Prancha", sets: "4 x 45s", detail: "Isometria" }] }
        ],
        'Emagrecimento': [
          { day: "SEG", title: "SEG: HIIT & CORE", exercises: [{ exercise: "Tiro na Esteira", sets: "10 x 1 min", detail: "Descanso 30s" }, { exercise: "Prancha Frontal", sets: "4 x 1 min", detail: "Isometria" }, { exercise: "Abdominal Remador", sets: "4 x 20", detail: "Explosão" }, { exercise: "Burpees", sets: "4 x 15", detail: "Intenso" }] },
          { day: "TER", title: "TER: CIRCUITO SUPERIOR", exercises: [{ exercise: "Flexão de Braço", sets: "4 x Falha", detail: "Sem pausa" }, { exercise: "Remada TRX", sets: "4 x 15", detail: "Rápido" }, { exercise: "Polichinelo", sets: "4 x 50", detail: "Cardio" }, { exercise: "Desenvolvimento Arnold", sets: "4 x 15", detail: "Leve" }] },
          { day: "QUA", title: "QUA: CARDIO LONGO", exercises: [{ exercise: "Bicicleta", sets: "45 min", detail: "Ritmo moderado" }, { exercise: "Abdominal Infra", sets: "4 x 20", detail: "No solo" }, { exercise: "Prancha Lateral", sets: "3 x 45s", detail: "Cada lado" }] },
          { day: "QUI", title: "QUI: CIRCUITO INFERIOR", exercises: [{ exercise: "Agachamento Salto", sets: "4 x 20", detail: "Explosão" }, { exercise: "Afundo Alternado", sets: "4 x 20", detail: "Dinâmico" }, { exercise: "Pular Corda", sets: "4 x 3 min", detail: "Cardio" }, { exercise: "Elevação Pélvica Solo", sets: "4 x 20", detail: "Rápido" }] },
          { day: "SEX", title: "SEX: METABÓLICO", exercises: [{ exercise: "Kettlebell Swing", sets: "4 x 20", detail: "Potência" }, { exercise: "Mountain Climber", sets: "4 x 40", detail: "Rápido" }, { exercise: "Thruster", sets: "4 x 15", detail: "Halteres leves" }, { exercise: "Corrida Estacionária", sets: "4 x 1 min", detail: "Joelhos altos" }] },
          { day: "SAB", title: "SAB: DESAFIO CARDIO", exercises: [{ exercise: "Corrida Rua", sets: "5 km", detail: "Melhor tempo" }, { exercise: "Alongamento Geral", sets: "15 min", detail: "Recuperação" }] }
        ],
        'Glúteos & Core': [
          { day: "SEG", title: "SEG: GLÚTEO MÁXIMO", exercises: [{ exercise: "Elevação Pélvica Barra", sets: "4 x 10", detail: "Pausa no topo" }, { exercise: "Agachamento Sumô", sets: "4 x 12", detail: "Halter" }, { exercise: "Glúteo Polia", sets: "4 x 15", detail: "Perna estendida" }] },
          { day: "TER", title: "TER: CORE INTENSO", exercises: [{ exercise: "Prancha com Movimento", sets: "4 x 45s", detail: "Toca ombro" }, { exercise: "Abdominal Bicicleta", sets: "4 x 30", detail: "Tronco alto" }, { exercise: "Elevação de Pernas", sets: "4 x 15", detail: "Lento na descida" }] },
          { day: "QUA", title: "QUA: GLÚTEO MÉDIO", exercises: [{ exercise: "Cadeira Abdutora", sets: "4 x 15", detail: "Tronco inclinado" }, { exercise: "Elevação Pélvica Unilateral", sets: "4 x 12", detail: "Cada perna" }, { exercise: "Passada", sets: "4 x 20 passos", detail: "Com halteres" }] },
          { day: "QUI", title: "QUI: DESCANSO ATIVO", exercises: [{ exercise: "Caminhada", sets: "30 min", detail: "Ritmo leve" }, { exercise: "Mobilidade Quadril", sets: "15 min", detail: "Foco articular" }] },
          { day: "SEX", title: "SEX: ISOLAMENTO", exercises: [{ exercise: "Glúteo 4 Apoios", sets: "4 x 15", detail: "Caneleira" }, { exercise: "Levantamento Terra", sets: "4 x 10", detail: "Barra" }, { exercise: "Stiff", sets: "4 x 12", detail: "Barra" }] },
          { day: "SAB", title: "SAB: CORE & CARDIO", exercises: [{ exercise: "Abdominal Remador", sets: "4 x 20", detail: "Completo" }, { exercise: "Prancha Frontal", sets: "4 x 1 min", detail: "Isometria" }, { exercise: "Escada", sets: "20 min", detail: "Cardio" }] }
        ],
        'Condicionamento': [
          { day: "SEG", title: "SEG: FORÇA TOTAL", exercises: [{ exercise: "Levantamento Terra", sets: "4 x 8", detail: "Pesado" }, { exercise: "Supino Reto", sets: "4 x 8", detail: "Pesado" }, { exercise: "Barra Fixa", sets: "4 x Falha", detail: "Livre" }] },
          { day: "TER", title: "TER: CAPACIDADE AERÓBICA", exercises: [{ exercise: "Remo Seco", sets: "4 x 5 min", detail: "Intenso" }, { exercise: "Pular Corda", sets: "5 x 3 min", detail: "Constante" }] },
          { day: "QUA", title: "QUA: POTÊNCIA", exercises: [{ exercise: "Box Jump", sets: "4 x 10", detail: "Salto na caixa" }, { exercise: "Medicine Ball Slam", sets: "4 x 15", detail: "Explosão" }, { exercise: "Kettlebell Swing", sets: "4 x 15", detail: "Pesado" }] },
          { day: "QUI", title: "QUI: RESISTÊNCIA MUSCULAR", exercises: [{ exercise: "Flexão de Braço", sets: "4 x 20", detail: "Controlado" }, { exercise: "Agachamento Livre", sets: "4 x 20", detail: "Sem peso" }, { exercise: "Barra Supinada", sets: "4 x 12", detail: "Controlado" }] },
          { day: "SEX", title: "SEX: MOBILIDADE & CORE", exercises: [{ exercise: "Prancha", sets: "4 x 1 min", detail: "Firme" }, { exercise: "Abdominal Canivete", sets: "4 x 15", detail: "Completo" }, { exercise: "Yoga/Alongamento", sets: "20 min", detail: "Corpo todo" }] },
          { day: "SAB", title: "SAB: DESAFIO FINAL", exercises: [{ exercise: "Burpees", sets: "100 repetições", detail: "Menor tempo possível" }, { exercise: "Corrida", sets: "3 km", detail: "Ritmo forte" }] }
        ]
      };

      const weeklyCycle = templates[workoutType] || templates['Hipertrofia'];

      const selectedStudent = studentsData.find(s => s.id === selectedStudentId);
      const studentName = selectedStudent ? selectedStudent.name : 'Desconhecida';

      const { error } = await supabase.from('planilhas_treino').insert({
        aluna_id: selectedStudentId,
        titulo: `Aluna - ${studentName} ( Treino Semanal ) foco em ${workoutType}`,
        foco: workoutType,
        conteudo_treino: { workouts: weeklyCycle },
        descricao: `Treino semanal gerado automaticamente com foco em ${workoutType} para ${studentName}. Cobertura total de SEG a SAB.`
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

  const handleSaveManualWorkout = async () => {
    if (!selectedStudentId) {
      showNotification('Selecione uma aluna primeiro.', 'error');
      return;
    }
    if (!manualTitle) {
      showNotification('Digite um título para a planilha.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedStudent = studentsData.find(s => s.id === selectedStudentId);
      const studentName = selectedStudent ? selectedStudent.name : 'Desconhecida';

      const cleanedWorkouts = manualWorkouts.map(w => ({
        ...w,
        exercises: w.exercises.filter(ex => ex.exercise.trim() !== '')
      }));

      const { error } = await supabase.from('planilhas_treino').insert({
        aluna_id: selectedStudentId,
        titulo: manualTitle,
        foco: manualFocus,
        conteudo_treino: { workouts: cleanedWorkouts },
        descricao: `Planilha manual com foco em ${manualFocus} para ${studentName}.`
      });

      if (error) throw error;

      await fetchWorkouts();
      setShowWorkoutModal(false);

      setManualTitle('');
      setManualFocus('Hipertrofia');
      setManualWorkouts([
        { day: "SEG", title: "SEG: Quadríceps & Panturrilha", exercises: [{ exercise: "", sets: "", detail: "" }] },
        { day: "TER", title: "TER: Peito & Tríceps", exercises: [{ exercise: "", sets: "", detail: "" }] },
        { day: "QUA", title: "QUA: Costas & Bíceps", exercises: [{ exercise: "", sets: "", detail: "" }] },
        { day: "QUI", title: "QUI: Ombro Isolado", exercises: [{ exercise: "", sets: "", detail: "" }] },
        { day: "SEX", title: "SEX: Glúteos & Posterior", exercises: [{ exercise: "", sets: "", detail: "" }] },
        { day: "SAB", title: "SAB: Full Body", exercises: [{ exercise: "", sets: "", detail: "" }] },
        { day: "DOM", title: "DOM: Descanso Ativo", exercises: [{ exercise: "", sets: "", detail: "" }] }
      ]);

      showNotification('Treino cadastrado com sucesso!');
    } catch (err) {
      console.error("Error saving manual workout:", err);
      showNotification('Erro ao cadastrar treino: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  }

  const updateDayTitle = (day, newTitle) => {
    setManualWorkouts(prev => prev.map(w => w.day === day ? { ...w, title: newTitle } : w));
  }

  const updateExerciseField = (day, index, field, value) => {
    setManualWorkouts(prev => prev.map(w => {
      if (w.day === day) {
        const newExercises = [...w.exercises];
        newExercises[index] = { ...newExercises[index], [field]: value };
        return { ...w, exercises: newExercises };
      }
      return w;
    }));
  }

  const addExerciseRow = (day) => {
    setManualWorkouts(prev => prev.map(w => {
      if (w.day === day) {
        return { ...w, exercises: [...w.exercises, { exercise: "", sets: "", detail: "" }] };
      }
      return w;
    }));
  }

  const removeExerciseRow = (day, index) => {
    setManualWorkouts(prev => prev.map(w => {
      if (w.day === day) {
        const newExercises = w.exercises.filter((_, idx) => idx !== index);
        return { ...w, exercises: newExercises.length > 0 ? newExercises : [{ exercise: "", sets: "", detail: "" }] };
      }
      return w;
    }));
  }

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      return digits.length > 0 ? `(${digits}` : '';
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };


  return (
    <div className="h-[100dvh] bg-black text-white flex overflow-hidden">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
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

      <div className="absolute inset-0 mix-blend-overlay z-0 pointer-events-none opacity-10">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop"
          alt="Gym Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/80" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 z-[100] lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 flex flex-col w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 p-6 h-full z-[110] transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-10 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center">
              <span className="text-white font-display font-black text-xl">RM</span>
            </div>
            <div>
              <span className="font-display font-black text-base text-white">RAYANA</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-bordeaux font-black">Admin Hub</span>
            </div>
          </Link>
          <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
          {adminLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setActiveTab(link.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 ${activeTab === link.id
                  ? 'bg-bordeaux/20 text-white border border-bordeaux/30'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                }`}
            >
              <link.icon className={`w-5 h-5 ${activeTab === link.id ? 'text-bordeaux' : ''}`} />
              {link.label}
            </button>
          ))}
        </nav>

        {/* Footer info inside Admin sidebar */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2 mt-auto">
          <a
            href="https://automize-one.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-white/30 hover:text-white/60 font-bold transition-all text-center flex items-center justify-center gap-1 bg-white/5 py-2 rounded-xl cursor-pointer"
          >
            Desenvolvido por <span className="text-rose-soft">Automize</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto relative z-10 bg-black">
        <header className="flex lg:justify-end items-center justify-between p-4 lg:p-6 bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="flex lg:hidden items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-white/60 hover:text-white transition-colors">
              <FiMenu size={24} />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center">
              <span className="text-white font-display font-black text-xs">RM</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: FiUsers, label: 'Alunas Ativas', value: stats.activeStudents, change: '+0%', color: 'text-wine-800', bg: 'bg-wine-800/10' },
                  { icon: FiDollarSign, label: 'Receita Mensal', value: `R$ ${stats.monthlyRevenue}`, change: '+0%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { icon: FiActivity, label: 'Treinos Gerados', value: stats.workoutsGenerated, change: '+0', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { icon: FiTrendingUp, label: 'Taxa Retenção', value: `${stats.retentionRate}%`, change: '+0%', color: 'text-bordeaux', bg: 'bg-bordeaux/10' },
                ].map((s, i) => (
                  <div key={i} className="backdrop-blur-xl rounded-[32px] p-6 border border-white/5 bg-white/5 shadow-2xl">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-white/40">{s.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="font-display font-black text-3xl text-white">{s.value}</p>
                      <span className={`text-[10px] font-black ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="font-display font-black text-lg uppercase tracking-tight text-white">Ações Rápidas</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => {
                        setEditingUser(null);
                        setGeneratedUser('');
                        setGeneratedPassword('');
                        setNewUserPlan('Premium');
                        setNewUserStatus('Ativo');
                        setNewUserExpiration('');
                        setNewUserContact('');
                        setCreateError(null);
                        setIsCreatingUser(true);
                      }}
                      className="flex items-center gap-4 p-5 rounded-3xl backdrop-blur-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-wine-900/40 transition-all group text-left shadow-2xl"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-wine-900/20 flex items-center justify-center group-hover:bg-wine-900/40 transition-all">
                        <FiPlus className="w-6 h-6 text-wine-800" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tight text-white">Gerar Acesso</p>
                        <p className="text-white/30 text-[10px]">Criar usuário e senha</p>
                      </div>
                    </button>
                    <button
                      onClick={() => { setShowWorkoutModal(true); setSelectedStudentId(''); }}
                      className="flex items-center gap-4 p-5 rounded-3xl backdrop-blur-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-bordeaux/40 transition-all group text-left shadow-2xl"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-bordeaux/10 flex items-center justify-center group-hover:bg-bordeaux/20 transition-all">
                        <FiTarget className="w-6 h-6 text-bordeaux" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tight text-white">Gerar Planilha</p>
                        <p className="text-white/30 text-[10px]">Lançar novo ciclo</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="font-display font-black text-lg uppercase tracking-tight text-white opacity-0 hidden lg:block">_</h2>
                  <div className="backdrop-blur-xl rounded-[32px] p-8 border border-white/5 bg-white/5 shadow-2xl h-[calc(100%-3rem)]">
                    <h3 className="font-display font-black text-xs uppercase tracking-widest mb-6 text-white">Planos Ativos</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Essencial', val: studentsData.filter(s => s.plano === 'Essencial').length, color: 'bg-white/20' },
                        { label: 'Premium', val: studentsData.filter(s => s.plano === 'Premium').length, color: 'bg-wine-800' },
                        { label: 'VIP Elite', val: studentsData.filter(s => s.plano === 'VIP Elite').length, color: 'bg-bordeaux' },
                      ].map((p, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white/40">{p.label}</span>
                            <span className="text-white">{p.val}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/5">
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
                  <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-white">Gestão de Alunas</h2>
                  <p className="text-white/40 text-sm">Gerencie todos os acessos e perfis ativos.</p>
                </div>
                <button onClick={() => {
                  setGeneratedUser('')
                  setGeneratedPassword('')
                  setNewUserPlan('Premium')
                  setNewUserStatus('Ativo')
                  setNewUserExpiration('')
                  setNewUserContact('')
                  setEditingUser(null)
                  setCreateError(null)
                  setIsCreatingUser(true)
                }} className="px-6 py-3 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl">Nova Aluna</button>
              </div>

              <div className="backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/5 bg-white/5 shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-4">
                  <FiSearch className="text-white/40" />
                  <input type="text" placeholder="Buscar por nome ou plano..." className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white" />
                </div>

                <div className="hidden md:grid md:grid-cols-5 p-6 text-[10px] font-black uppercase tracking-widest border-b text-white/40 border-white/5">
                  <div>Aluna</div>
                  <div>Plano</div>
                  <div>Cadastro</div>
                  <div>Status</div>
                  <div className="text-right">Ações</div>
                </div>

                <div className="divide-y divide-white/5">
                  {studentsData.map((s, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-5 items-center p-4 sm:p-6 gap-4 md:gap-0 hover:bg-white/[0.02] transition-colors border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center text-white font-black text-xs shadow-lg">{s.name[0]}</div>
                        <div>
                          <span className="font-bold text-sm block text-white">{s.name}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mt-0.5">{s.objective}</span>
                          {s.contact && (
                            <div className="flex items-center gap-1.5 mt-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[9px] font-black tracking-wider whitespace-nowrap">{s.contact}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm inline-block ${
                          s.plano === 'Desenvolvedor'
                            ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                            : s.plano === 'Administrador'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : s.plano === 'VIP Elite'
                                ? 'bg-bordeaux/20 text-rose-soft border-bordeaux/30'
                                : s.plano === 'Premium'
                                  ? 'bg-wine-900/20 text-white border-white/10'
                                  : 'bg-white/5 text-white/50 border-white/5'
                        }`}>
                          {s.plano}
                        </span>
                      </div>

                      <div className="hidden md:flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">Criado em</span>
                        <span className="text-xs font-bold text-white">{s.lastCheck}</span>
                      </div>

                      <div className="flex md:block items-center justify-between">
                        <span className="md:hidden text-[10px] font-black uppercase tracking-widest opacity-30">Status</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${s.status === 'Inativo'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                          {s.status || 'Ativo'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        {s.status === 'Inativo' ? (
                          <button
                            onClick={() => handleToggleStatus(s)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 cursor-pointer"
                          >
                            <FiUnlock size={12} />
                            <span className="hidden md:inline">Ativar</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(s)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/25 cursor-pointer"
                          >
                            <FiLock size={12} />
                            <span className="hidden md:inline">Inativar</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEditStudent(s)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 cursor-pointer"
                        >
                          <FiEdit size={12} />
                          <span className="hidden md:inline">Editar</span>
                        </button>
                        {/* Developer-only: delete any user incl. admins */}
                        {isDeveloper ? (
                          <>
                            <button
                              onClick={() => handleDeleteStudent(s.name)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              <FiTrash2 size={12} />
                              <span className="hidden md:inline">Excluir</span>
                            </button>
                            {s.role !== 'desenvolvedor' && (
                              <button
                                onClick={() => handleSetRole(s, 'desenvolvedor')}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 cursor-pointer"
                                title="Definir como Desenvolvedor"
                              >
                                <FiShield size={12} />
                                <span className="hidden md:inline">Dev</span>
                              </button>
                            )}
                            {s.role === 'admin' && (
                              <button
                                onClick={() => handleSetRole(s, 'aluna')}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
                                title="Rebaixar Admin"
                              >
                                <FiArrowLeft size={12} />
                                <span className="hidden md:inline">Rebaixar</span>
                              </button>
                            )}
                          </>
                        ) : (
                          // Non-developer: can't delete admins
                          s.role !== 'admin' && s.role !== 'desenvolvedor' && (
                            <button
                              onClick={() => handleDeleteStudent(s.name)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              <FiTrash2 size={12} />
                              <span className="hidden md:inline">Excluir</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inspect_workouts' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-white">Verificar Treinos</h2>
                  <p className="text-white/40 text-sm">Inspecione de forma detalhada as planilhas semanais das alunas.</p>
                </div>
                <button
                  onClick={() => setShowWorkoutModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl cursor-pointer"
                >
                  Criar Treino IA / Manual
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Students list for selection */}
                <div className="backdrop-blur-xl rounded-[32px] p-6 border border-white/5 bg-white/5 shadow-2xl space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">Selecione uma Aluna</h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {studentsData.filter(s => s.role !== 'admin' && s.role !== 'desenvolvedor').map((student) => {
                      const hasWorkout = workoutsList.some(w => w.usuarios?.usuario === student.name || w.aluna_id === student.id);
                      const isSelected = selectedInspectStudent?.name === student.name;
                      return (
                        <button
                          key={student.id}
                          onClick={() => {
                            setSelectedInspectStudent(student);
                            setInspectDayTab('SEG');
                          }}
                          className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between group cursor-pointer ${isSelected
                              ? 'bg-gradient-to-r from-wine-900 to-bordeaux border-bordeaux text-white shadow-lg'
                              : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/10'
                            }`}
                        >
                          <div>
                            <p className="font-bold text-sm tracking-tight">{student.name}</p>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-bordeaux'}`}>
                              {student.plano}
                            </p>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${hasWorkout
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/10'
                            }`}>
                            {hasWorkout ? 'Ativo' : 'Sem Treino'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workout Inspector Sheet */}
                <div className="lg:col-span-2 backdrop-blur-xl rounded-[32px] p-8 border border-white/5 bg-white/5 shadow-2xl">
                  {selectedInspectStudent ? (() => {
                    const studentWorkout = workoutsList.find(w => w.usuarios?.usuario === selectedInspectStudent.name || w.aluna_id === selectedInspectStudent.id);
                    const workoutsArray = studentWorkout?.conteudo_treino?.workouts || [];
                    const activeDayWorkout = workoutsArray.find(d => d.day === inspectDayTab);

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-bordeaux">Inspeção Ativa</span>
                            <h3 className="font-display font-black text-2xl text-white">{selectedInspectStudent.name}</h3>
                            <p className="text-white/40 text-xs mt-0.5">Objetivo: {selectedInspectStudent.objective} • Plano: {selectedInspectStudent.plano}</p>
                          </div>
                          {studentWorkout && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  // Open edit modal pre-filled with current workout
                                  const workoutsClone = JSON.parse(JSON.stringify(studentWorkout.conteudo_treino?.workouts || []));
                                  setEditWorkoutData({ workoutId: studentWorkout.id, workouts: workoutsClone });
                                  setEditDayTab(workoutsClone[0]?.day || 'SEG');
                                  setIsEditingWorkout(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-wine-900 to-bordeaux text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md hover:shadow-wine transition-all cursor-pointer"
                              >
                                Editar Planilha
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudentId(selectedInspectStudent.id);
                                  setSelectedWorkout(studentWorkout);
                                }}
                                className="px-4 py-2 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-wine-900 transition-all cursor-pointer"
                              >
                                Detalhes Completos
                              </button>
                            </div>
                          )}
                        </div>

                        {studentWorkout ? (
                          <div className="space-y-6">
                            {/* Days selector tab bar */}
                            <div className="flex flex-wrap gap-2">
                              {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((day) => {
                                const isDaySelected = inspectDayTab === day;
                                const dayWorkout = workoutsArray.find(d => d.day === day);
                                return (
                                  <button
                                    key={day}
                                    onClick={() => setInspectDayTab(day)}
                                    className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border cursor-pointer ${isDaySelected
                                        ? 'bg-bordeaux border-bordeaux text-white shadow-md'
                                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                      }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Active Day Exercises inspect card */}
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h4 className="font-display font-black text-sm uppercase tracking-tight text-white">
                                  {activeDayWorkout?.title || `${inspectDayTab}: Treino de Descanso`}
                                </h4>
                                <span className="text-[10px] font-black text-bordeaux uppercase tracking-widest">
                                  {activeDayWorkout?.exercises?.length || 0} Exercícios
                                </span>
                              </div>

                              {activeDayWorkout?.exercises && activeDayWorkout.exercises.length > 0 ? (
                                <div className="space-y-3">
                                  {activeDayWorkout.exercises.map((ex, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div>
                                        <p className="font-bold text-white text-sm">{ex.exercise}</p>
                                        {ex.detail && <p className="text-[10px] text-white/40 mt-0.5">{ex.detail}</p>}
                                      </div>
                                      <span className="px-3.5 py-1.5 rounded-lg bg-bordeaux/20 text-bordeaux text-xs font-black uppercase tracking-wider shrink-0 select-none border border-bordeaux/10">
                                        {ex.sets}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-8 text-center text-white/40 text-xs font-medium">
                                  Nenhum exercício cadastrado para este dia da semana.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/10">
                              <FiAlertCircle size={28} />
                            </div>
                            <h4 className="font-black text-white text-base mb-1">Sem Planilha Ativa</h4>
                            <p className="text-white/40 text-xs max-w-sm mb-6">Esta aluna ainda não possui nenhuma planilha de treinos gerada no sistema.</p>
                            <button
                              onClick={() => {
                                setSelectedStudentId(selectedInspectStudent.id);
                                setWorkoutType(selectedInspectStudent.plano === 'VIP Elite' ? 'Glúteos & Core' : 'Hipertrofia');
                                setManualTitle(`Planilha Semanal - ${selectedInspectStudent.name}`);
                                setShowWorkoutModal(true);
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:shadow-wine transition-all cursor-pointer"
                            >
                              Gerar / Cadastrar Treino
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })() : (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 mb-4">
                        <FiSearch size={28} />
                      </div>
                      <h4 className="font-black text-white text-base mb-1">Selecione uma Aluna</h4>
                      <p className="text-white/40 text-xs max-w-xs">Clique em qualquer aluna na barra lateral para inspecionar seus treinos e rotinas semanais.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-white">Cobranças & Planos</h2>
                <p className="text-white/40 text-sm">Monitore o status financeiro e envie notificações automáticas de vencimento via WhatsApp.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card: Assinaturas Ativas */}
                <div className="relative p-6 rounded-[2rem] overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.08)]" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0.03) 100%)' }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent rounded-t-[2rem]" />
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                    <FiUsers size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400/70 tracking-[0.25em]">Assinaturas Ativas</span>
                    <h3 className="text-4xl font-black text-white mt-2 mb-1">
                      {studentsData.filter(s => s.status === 'Ativo').length}
                    </h3>
                    <p className="text-sm text-white/40 font-medium">alunas ativas no plano</p>
                  </div>
                </div>

                {/* Card: A Vencer */}
                {(() => {
                  const expiringCount = studentsData.filter(s => {
                    if (!s.expirationDate) return false;
                    const expDate = new Date(s.expirationDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 7;
                  }).length;
                  return (
                    <div className="relative p-6 rounded-[2rem] overflow-hidden border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.08)]" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(255,255,255,0.03) 100%)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent rounded-t-[2rem]" />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                        <FiAlertCircle size={20} className={expiringCount > 0 ? 'text-amber-400 animate-pulse' : 'text-amber-400'} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-400/70 tracking-[0.25em]">A Vencer (próx 7 dias)</span>
                        <h3 className={`text-4xl font-black mt-2 mb-1 ${expiringCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                          {expiringCount}
                        </h3>
                        <p className="text-sm text-white/40 font-medium">planos a vencer em breve</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Card: Assinaturas Inativas */}
                <div className="relative p-6 rounded-[2rem] overflow-hidden border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.08)]" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(255,255,255,0.03) 100%)' }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent rounded-t-[2rem]" />
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                    <FiX size={20} className="text-red-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-400/70 tracking-[0.25em]">Assinaturas Inativas</span>
                    <h3 className="text-4xl font-black text-white mt-2 mb-1">
                      {studentsData.filter(s => s.status === 'Inativo').length}
                    </h3>
                    <p className="text-sm text-white/40 font-medium">contas desativadas</p>
                  </div>
                </div>
              </div>


              {/* Invoices table / list */}
              <div className="backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/5 bg-white/5 shadow-2xl">
                <div className="p-6 border-b border-white/5">
                  <h3 className="font-display font-black text-lg text-white">Relatório de Assinaturas</h3>
                </div>

                <div className="divide-y divide-white/5">
                  {studentsData.map((student) => {
                    // Calculation of remaining days
                    const getRemainingDaysInfo = (expirationDate) => {
                      if (!expirationDate) return { text: 'Sem Vencimento Definido', days: 999, status: 'none', color: 'text-white/40 bg-white/5 border-white/5' };
                      const expDate = new Date(expirationDate);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const diffTime = expDate - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                      const formattedExpDate = new Date(expirationDate).toLocaleDateString('pt-BR');

                      if (diffDays < 0) {
                        return { text: `Vencido há ${Math.abs(diffDays)} dias (${formattedExpDate})`, days: diffDays, status: 'expired', color: 'text-red-400 bg-red-500/10 border-red-500/10' };
                      }
                      if (diffDays === 0) {
                        return { text: `Vence Hoje! (${formattedExpDate})`, days: diffDays, status: 'today', color: 'text-rose-400 bg-rose-500/10 border-rose-500/10 animate-pulse' };
                      }
                      if (diffDays <= 7) {
                        return { text: `Vence em ${diffDays} dias (${formattedExpDate})`, days: diffDays, status: 'warning', color: 'text-amber-400 bg-amber-500/10 border-amber-500/10' };
                      }
                      return { text: `Vence em ${diffDays} dias (${formattedExpDate})`, days: diffDays, status: 'active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10' };
                    };

                    const statusInfo = getRemainingDaysInfo(student.expirationDate);

                    // Predefined customized friendly reminder message
                    const reminderMsg = `Olá, ${student.name}! 🌟 Passando para lembrar que a sua assinatura da consultoria Rayana Maria vence em breve (${student.expirationDate ? new Date(student.expirationDate).toLocaleDateString('pt-BR') : ''}). Vamos renovar para continuar firmes nos seus treinos e evolução? Qualquer dúvida estou por aqui!`;

                    const rawContact = student.contact ? student.contact.replace(/\D/g, '') : '';
                    const formattedContact = rawContact.length > 0
                      ? (rawContact.startsWith('55') ? rawContact : '55' + rawContact)
                      : '';
                    const whatsappBillingUrl = formattedContact
                      ? `https://wa.me/${formattedContact}?text=${encodeURIComponent(reminderMsg)}`
                      : `https://wa.me/558174016680?text=${encodeURIComponent(reminderMsg)}`;

                    return (
                      <div key={student.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white-[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center text-white shrink-0 font-bold shadow-lg`}>
                            {student.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{student.name}</h4>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${student.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                {student.status}
                              </span>
                            </div>
                            <p className="text-white/40 text-xs mt-1">
                              <span>Plano: {student.plano}</span>
                            </p>
                            {student.contact ? (
                              <div className="flex items-center gap-1.5 mt-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[9px] font-black tracking-wider whitespace-nowrap">{student.contact}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 mt-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span className="text-[9px] font-black tracking-wider whitespace-nowrap">⚠️ Sem WhatsApp</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>

                          <a
                            href={whatsappBillingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-gradient-to-r from-wine-900 to-bordeaux rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:shadow-wine transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <FiDollarSign size={12} /> Cobrar
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-bordeaux">Conta Admin</p>
                <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-white">Meu Perfil</h2>
              </div>

              {/* Identity Card */}
              <div className="backdrop-blur-xl rounded-[32px] p-8 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-bordeaux/10 blur-3xl rounded-full pointer-events-none" />
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-wine-950 to-bordeaux flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                    A
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">Administrador</h3>
                    <p className="text-bordeaux font-black text-xs uppercase tracking-[0.3em]">@admin</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <FiArrowLeft size={18} className="text-white/60" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-white">Voltar ao site</p>
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Página principal RM</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { localStorage.removeItem('rm_user'); navigate('/login') }}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <FiLogOut size={18} className="text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-red-400">Sair da conta</p>
                      <p className="text-[10px] text-red-400/50 font-black uppercase tracking-widest">Encerrar sessão</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ─── Workout Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {isEditingWorkout && editWorkoutData && (() => {
          // Derive from state on each render — no stale closure
          const currentDayIndex = editWorkoutData.workouts.findIndex(w => w.day === editDayTab);
          const safeIdx = currentDayIndex >= 0 ? currentDayIndex : 0;
          const currentDay = editWorkoutData.workouts[safeIdx];
          return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
                style={{ background: '#0d0d0d' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/8 shrink-0">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bordeaux mb-1">Modo Edição</p>
                    <h2 className="text-xl font-black text-white">Editar Planilha — {currentDay?.day}</h2>
                  </div>
                  <button onClick={() => { setIsEditingWorkout(false); setEditWorkoutData(null); }} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                    <FiX size={20} />
                  </button>
                </div>

                {/* Day tabs */}
                <div className="flex gap-2 px-8 pt-5 shrink-0 flex-wrap">
                  {editWorkoutData.workouts.map((w) => (
                    <button
                      key={w.day}
                      onClick={() => setEditDayTab(w.day)}
                      className={`px-3.5 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border cursor-pointer ${w.day === editDayTab ? 'bg-bordeaux border-bordeaux text-white shadow-md' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                    >
                      {w.day}
                    </button>
                  ))}
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
                  {/* Day title */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Título do Dia</label>
                    <input
                      value={currentDay?.title || ''}
                      onChange={(e) => editUpdateDayTitle(safeIdx, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-bordeaux/60 transition-all"
                      placeholder={`${editDayTab}: Título do treino`}
                    />
                  </div>

                  {/* Exercises */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Exercícios</label>
                    {(currentDay?.exercises || []).map((ex, exIdx) => (
                      <div key={exIdx} className="p-4 rounded-2xl bg-white/4 border border-white/6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Exercício {exIdx + 1}</span>
                          <button onClick={() => editRemoveExercise(safeIdx, exIdx)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all cursor-pointer">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                        <input
                          value={ex.exercise}
                          onChange={(e) => editUpdateExercise(safeIdx, exIdx, 'exercise', e.target.value)}
                          placeholder="Nome do exercício"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-bordeaux/60 transition-all"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={ex.sets}
                            onChange={(e) => editUpdateExercise(safeIdx, exIdx, 'sets', e.target.value)}
                            placeholder="Séries (ex: 4x12)"
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-bordeaux/60 transition-all"
                          />
                          <input
                            value={ex.detail}
                            onChange={(e) => editUpdateExercise(safeIdx, exIdx, 'detail', e.target.value)}
                            placeholder="Detalhe (ex: 60s rest)"
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-bordeaux/60 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => editAddExercise(safeIdx)} className="w-full py-3 rounded-xl border border-dashed border-white/15 text-white/40 hover:text-white hover:border-bordeaux/50 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <FiPlus size={14} /> Adicionar Exercício
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-8 py-5 border-t border-white/8 shrink-0">
                  <button onClick={() => { setIsEditingWorkout(false); setEditWorkoutData(null); }} className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/8 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">
                    Cancelar
                  </button>
                  <button onClick={handleSaveWorkout} disabled={isSavingWorkout} className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-wine-900 to-bordeaux text-white font-black text-xs uppercase tracking-widest shadow-wine hover:shadow-lg transition-all cursor-pointer disabled:opacity-60">
                    {isSavingWorkout ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>


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

              <h2 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{editingUser ? 'Editar Acesso' : 'Gerar Novo Acesso'}</h2>
              <p className={`text-sm mb-8 font-medium ${isDarkMode ? 'text-white/60' : 'text-wine-900/60'}`}>{editingUser ? 'Atualize os dados da aluna.' : 'Preencha os dados da aluna para criar o login.'}</p>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSavingUser(true);
                setCreateError(null);
                try {
                  const wasEditing = !!editingUser;
                  if (editingUser) {
                    // Prepare update payload
                    const updateData = {
                      usuario: generatedUser,
                      plano: newUserPlan,
                      status: newUserStatus
                    };
                    if (generatedPassword) {
                      updateData.senha = generatedPassword;
                    }

                    const { error } = await supabase
                      .from('usuarios')
                      .update(updateData)
                      .eq('usuario', editingUser);

                    if (error) throw error;
                    
                    // Update in local storage for missing columns
                    const storedVencimentos = JSON.parse(localStorage.getItem('rm_vencimentos') || '{}');
                    if (newUserExpiration) storedVencimentos[generatedUser] = newUserExpiration;
                    else delete storedVencimentos[generatedUser];
                    localStorage.setItem('rm_vencimentos', JSON.stringify(storedVencimentos));

                    const storedContatos = JSON.parse(localStorage.getItem('rm_contatos') || '{}');
                    if (newUserContact) storedContatos[generatedUser] = newUserContact;
                    else delete storedContatos[generatedUser];
                    localStorage.setItem('rm_contatos', JSON.stringify(storedContatos));

                  } else {
                    // Insert new
                    const { error } = await supabase.from('usuarios').insert({
                      usuario: generatedUser,
                      senha: generatedPassword,
                      role: newUserPlan === 'Administrador' ? 'admin' : 'aluna',
                      plano: newUserPlan,
                      status: newUserStatus
                    });

                    if (error) {
                      if (error.message.includes('unique constraint') || error.message.includes('duplicate')) {
                        setCreateError('Este nome de usuário já está sendo usado. Por favor, escolha outro.');
                      } else {
                        setCreateError(`Erro ao salvar: ${error.message}`);
                      }
                      setIsSavingUser(false);
                      return;
                    }
                    
                    // Save in local storage
                    const storedVencimentos = JSON.parse(localStorage.getItem('rm_vencimentos') || '{}');
                    if (newUserExpiration) storedVencimentos[generatedUser] = newUserExpiration;
                    localStorage.setItem('rm_vencimentos', JSON.stringify(storedVencimentos));

                    const storedContatos = JSON.parse(localStorage.getItem('rm_contatos') || '{}');
                    if (newUserContact) storedContatos[generatedUser] = newUserContact;
                    localStorage.setItem('rm_contatos', JSON.stringify(storedContatos));
                  }

                  await fetchData();
                  setEditingUser(null);
                  setTimeout(() => {
                    setIsCreatingUser(false);
                    setIsSavingUser(false);
                    if (!wasEditing) setShowNewUserModal(true);
                  }, 500);

                } catch (err) {
                  console.error("Erro ao salvar:", err);
                  setCreateError(`Atenção: Não foi possível salvar no banco de dados (${err.message || 'Erro Desconhecido'}).`);
                  setIsSavingUser(false);
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
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Senha de Acesso {editingUser && '(Deixe em branco para manter a atual)'}</label>
                  <input
                    type="text"
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    placeholder={editingUser ? "Nova senha (opcional)" : "ex: ray123"}
                    required={!editingUser}
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
                    <option value="Essencial" className="bg-[#1c1916] text-white">Essencial</option>
                    <option value="Premium" className="bg-[#1c1916] text-white">Premium</option>
                    <option value="VIP Elite" className="bg-[#1c1916] text-white">VIP Elite</option>
                    <option value="Administrador" className="bg-[#1c1916] text-white">Administrador</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Status de Acesso</label>
                    <select
                      value={newUserStatus}
                      onChange={(e) => setNewUserStatus(e.target.value)}
                      className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                    >
                      <option value="Ativo" className="bg-[#1c1916] text-white">Ativo</option>
                      <option value="Inativo" className="bg-[#1c1916] text-white">Inativo</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Data de Vencimento</label>
                    <input
                      type="date"
                      value={newUserExpiration}
                      onChange={(e) => setNewUserExpiration(e.target.value)}
                      className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>WhatsApp da Aluna (com DDD)</label>
                    <input
                      type="tel"
                      placeholder="Ex: (11) 99999-9999"
                      value={newUserContact}
                      onChange={(e) => setNewUserContact(formatPhoneNumber(e.target.value))}
                      className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                    />
                  </div>
                </div>

                <button type="submit" disabled={isSavingUser} className="w-full py-5 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-wine transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSavingUser ? <><FiRefreshCw className="animate-spin" /> {editingUser ? 'Salvando...' : 'Criando Acesso...'}</> : (editingUser ? 'Salvar Alterações' : 'Confirmar e Criar Acesso')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative border ${isDarkMode ? 'bg-wine-950 border-white/10' : 'bg-white border-wine-100'} text-center`}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 mx-auto">
                <FiAlertCircle size={32} />
              </div>
              <h2 className={`text-xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{confirmModal.title}</h2>
              <p className={`text-sm mb-8 font-medium ${isDarkMode ? 'text-white/60' : 'text-wine-900/60'}`}>{confirmModal.message}</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                  className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${isDarkMode ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white' : 'bg-wine-50 text-wine-900/60 hover:bg-wine-100 hover:text-wine-900'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="py-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-black uppercase tracking-widest text-[10px] transition-colors shadow-lg shadow-red-500/20"
                >
                  Confirmar
                </button>
              </div>
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
              className={`p-8 rounded-[2.5rem] w-full shadow-2xl relative border transition-all duration-500 ${workoutGenMode === 'manual' ? 'max-w-3xl max-h-[90vh] overflow-y-auto' : 'max-w-md'
                } ${isDarkMode ? 'bg-wine-950 border-white/10' : 'bg-white border-wine-100'}`}
            >
              <button onClick={() => setShowWorkoutModal(false)} className={`absolute top-6 right-6 transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-wine-900/40 hover:text-wine-900'}`}><FiX size={24} /></button>

              <h2 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>Gerenciar Treino</h2>
              <p className={`text-sm mb-6 font-medium ${isDarkMode ? 'text-white/60' : 'text-wine-900/60'}`}>Escolha gerar um treino completo por IA ou criar uma planilha manual.</p>

              {/* Tab Selector */}
              <div className={`flex border p-1 rounded-2xl mb-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-wine-50 border-wine-100'}`}>
                <button
                  onClick={() => setWorkoutGenMode('ai')}
                  className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all ${workoutGenMode === 'ai'
                      ? 'bg-gradient-to-r from-wine-900 to-bordeaux text-white shadow-lg'
                      : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-wine-900/40 hover:text-wine-900')
                    }`}
                >
                  Gerar via IA
                </button>
                <button
                  onClick={() => setWorkoutGenMode('manual')}
                  className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all ${workoutGenMode === 'manual'
                      ? 'bg-gradient-to-r from-wine-900 to-bordeaux text-white shadow-lg'
                      : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-wine-900/40 hover:text-wine-900')
                    }`}
                >
                  Cadastrar Manual
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Selecionar Aluna</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                  >
                    <option value="" className={isDarkMode ? "bg-wine-950 text-white/50" : "bg-white text-wine-950/50"}>Selecione uma aluna...</option>
                    {studentsData.map(s => (
                      <option key={s.id} value={s.id} className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>{s.name} ({s.plano})</option>
                    ))}
                  </select>
                </div>

                {workoutGenMode === 'ai' ? (
                  <>
                    <div>
                      <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Foco do Treino</label>
                      <select
                        value={workoutType}
                        onChange={(e) => setWorkoutType(e.target.value)}
                        className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                      >
                        <option value="Hipertrofia" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Hipertrofia (Massa Magra)</option>
                        <option value="Emagrecimento" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Emagrecimento (Cardio/HIT)</option>
                        <option value="Glúteos & Core" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Foco em Glúteos & Core</option>
                        <option value="Condicionamento" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Condicionamento Físico</option>
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
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Título da Planilha</label>
                        <input
                          type="text"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          placeholder="Ex: Treino Personalizado VIP"
                          className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Foco Principal</label>
                        <select
                          value={manualFocus}
                          onChange={(e) => setManualFocus(e.target.value)}
                          className={`w-full p-4 rounded-2xl border transition-all font-bold text-sm appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-bordeaux' : 'bg-wine-50 border-wine-100 text-wine-950 focus:border-wine-900'}`}
                        >
                          <option value="Hipertrofia" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Hipertrofia (Massa Magra)</option>
                          <option value="Emagrecimento" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Emagrecimento (Cardio/HIT)</option>
                          <option value="Glúteos & Core" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Foco em Glúteos & Core</option>
                          <option value="Condicionamento" className={isDarkMode ? "bg-wine-950 text-white" : "bg-white text-wine-950"}>Condicionamento Físico</option>
                        </select>
                      </div>
                    </div>

                    {/* Day Selection Row */}
                    <div className="pt-4 border-t border-white/10">
                      <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Selecione o Dia para Editar</label>
                      <div className="flex flex-wrap gap-2">
                        {manualWorkouts.map(w => (
                          <button
                            key={w.day}
                            type="button"
                            onClick={() => setActiveManualDay(w.day)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeManualDay === w.day
                                ? 'bg-gradient-to-r from-wine-900 to-bordeaux text-white border-transparent shadow-md'
                                : (isDarkMode ? 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10' : 'bg-wine-50 border-wine-100 text-wine-950 hover:bg-wine-100')
                              }`}
                          >
                            {w.day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editor for Active Day */}
                    {(() => {
                      const dayWorkout = manualWorkouts.find(w => w.day === activeManualDay);
                      if (!dayWorkout) return null;
                      return (
                        <div className={`p-6 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-wine-50 border-wine-100'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase text-bordeaux tracking-widest">Editando Treino de {activeManualDay}</span>
                          </div>

                          <div>
                            <label className={`block text-[10px] font-black uppercase tracking-[0.1em] mb-2 ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Título do Treino de {activeManualDay}</label>
                            <input
                              type="text"
                              value={dayWorkout.title}
                              onChange={(e) => updateDayTitle(activeManualDay, e.target.value)}
                              placeholder={`Ex: ${activeManualDay}: Perna e Glúteos`}
                              className={`w-full p-3.5 rounded-xl border transition-all font-bold text-sm ${isDarkMode ? 'bg-wine-950 border-white/10 text-white focus:border-bordeaux' : 'bg-white border-wine-100 text-wine-950 focus:border-wine-900'}`}
                            />
                          </div>

                          <div className="space-y-3 pt-2">
                            <label className={`block text-[10px] font-black uppercase tracking-[0.1em] ${isDarkMode ? 'text-white/40' : 'text-wine-900/40'}`}>Exercícios</label>

                            {dayWorkout.exercises.map((ex, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={ex.exercise}
                                    onChange={(e) => updateExerciseField(activeManualDay, idx, 'exercise', e.target.value)}
                                    placeholder="Exercício"
                                    className={`p-2.5 rounded-xl border font-bold text-xs ${isDarkMode ? 'bg-wine-950 border-white/10 text-white focus:border-bordeaux' : 'bg-white border-wine-100 text-wine-950 focus:border-wine-900'}`}
                                  />
                                  <input
                                    type="text"
                                    value={ex.sets}
                                    onChange={(e) => updateExerciseField(activeManualDay, idx, 'sets', e.target.value)}
                                    placeholder="Séries (4x12)"
                                    className={`p-2.5 rounded-xl border font-bold text-xs ${isDarkMode ? 'bg-wine-950 border-white/10 text-white focus:border-bordeaux' : 'bg-white border-wine-100 text-wine-950 focus:border-wine-900'}`}
                                  />
                                  <input
                                    type="text"
                                    value={ex.detail}
                                    onChange={(e) => updateExerciseField(activeManualDay, idx, 'detail', e.target.value)}
                                    placeholder="Detalhe"
                                    className={`p-2.5 rounded-xl border font-bold text-xs ${isDarkMode ? 'bg-wine-950 border-white/10 text-white focus:border-bordeaux' : 'bg-white border-wine-100 text-wine-950 focus:border-wine-900'}`}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeExerciseRow(activeManualDay, idx)}
                                  className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/20 shrink-0"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => addExerciseRow(activeManualDay)}
                              className={`w-full py-2.5 border border-dashed rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'border-white/20 text-white/50 hover:bg-white/5 hover:text-white' : 'border-wine-200 text-wine-900/60 hover:bg-wine-50'
                                }`}
                            >
                              + Adicionar Exercício
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    <button
                      onClick={handleSaveManualWorkout}
                      disabled={isGenerating || !selectedStudentId || !manualTitle}
                      className="w-full py-5 bg-gradient-to-r from-wine-900 to-bordeaux rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-wine transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isGenerating ? (
                        <><FiRefreshCw className="animate-spin" /> Salvando Planilha...</>
                      ) : 'Cadastrar Planilha de Treino'}
                    </button>
                  </>
                )}
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

              <div className="grid grid-cols-1 gap-6 mb-8">
                {selectedWorkout.conteudo_treino?.workouts ? (
                  <div className="space-y-6">
                    {selectedWorkout.conteudo_treino.workouts.map((day, dIdx) => (
                      <div key={dIdx} className="space-y-3">
                        <h3 className={`font-black uppercase tracking-widest text-sm pb-2 border-b ${isDarkMode ? 'text-bordeaux border-white/10' : 'text-wine-900 border-wine-100'}`}>
                          {day.title}
                        </h3>
                        <div className="space-y-2">
                          {day.exercises.map((ex, i) => (
                            <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-wine-50/50 border-wine-50'}`}>
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-wine-900/20 flex items-center justify-center text-bordeaux font-black text-xs shrink-0">
                                  {i + 1}
                                </div>
                                <div>
                                  <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-wine-950'}`}>{ex.exercise || ex.name}</h4>
                                  <p className={`text-[10px] opacity-60 uppercase font-black tracking-widest ${isDarkMode ? 'text-white' : 'text-wine-900'}`}>{ex.detail}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="inline-block px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black tracking-widest uppercase text-white">
                                  {ex.sets}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedWorkout.conteudo_treino?.exercises ? (
                  selectedWorkout.conteudo_treino.exercises.map((ex, i) => (
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
                  ))
                ) : (
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
            className={`fixed bottom-10 left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-xl border ${notification.type === 'success'
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
