import React, { useState, useEffect } from 'react';
import { Patient, CreatePatientInput, AuthUser } from '@/types';
import { patientsService } from '@/services/supabase';
import { authService } from '@/services/authService';
import { openWhatsAppChat } from '@/utils/helpers';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { PatientList } from '@/components/PatientList';
import { PatientForm } from '@/components/PatientForm';
import { StudentDetailsPage } from '@/pages/StudentDetailsPage';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Login } from '@/components/Login';
import { Signup } from '@/components/Signup';

type ActiveTab = 'home' | 'patients' | 'evolution';
type CurrentPage = 'main' | 'student-details';
type AuthPage = 'login' | 'signup';

export const App: React.FC = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // App state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentPage, setCurrentPage] = useState<CurrentPage>('main');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [evolutionSearchFilter, setEvolutionSearchFilter] = useState('');
  const [patientListSearchFilter, setPatientListSearchFilter] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [confirmDeactivate, setConfirmDeactivate] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
  }>({ isOpen: false, patientId: '', patientName: '' });
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
  }>({ isOpen: false, patientId: '', patientName: '' });

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setPatients([]);
      setAuthPage('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout');
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadPatients();
    }
  }, [currentUser]);

  useEffect(() => {
    // Quando mudar de aba, voltar para página principal
    setCurrentPage('main');
    setSelectedPatient(null);
    setEvolutionSearchFilter('');
  }, [activeTab]);

  const loadPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentUser) throw new Error('Usuário não autenticado');
      // 🔒 Filter patients by current professor
      const data = await patientsService.getAllPatientsByProfessor(currentUser.id);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = async (input: CreatePatientInput) => {
    setIsLoading(true);
    try {
      if (!currentUser) throw new Error('Usuário não autenticado');
      // Create the patient
      const newPatient = await patientsService.createPatient(input);
      // Associate with current professor
      await patientsService.associateStudentToProfessor(newPatient.id, currentUser.id);
      setShowPatientForm(false);
      await loadPatients();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEvolutions = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setCurrentPage('student-details');
    }
  };

  const handleDeactivatePatient = (patientId: string, patientName: string) => {
    setConfirmDeactivate({ isOpen: true, patientId, patientName });
  };

  const handleDeletePatient = (patientId: string, patientName: string) => {
    setConfirmDelete({ isOpen: true, patientId, patientName });
  };

  const handleConfirmDeactivation = async () => {
    try {
      setIsLoading(true);
      const patient = patients.find(p => p.id === confirmDeactivate.patientId);
      if (patient) {
        if (patient.active) {
          // Desativar
          await patientsService.deactivatePatient(confirmDeactivate.patientId);
        } else {
          // Reativar
          await patientsService.reactivatePatient(confirmDeactivate.patientId);
        }
      }
      setConfirmDeactivate({ isOpen: false, patientId: '', patientName: '' });
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar/reativar aluno');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await patientsService.deletePatient(confirmDelete.patientId);
      setConfirmDelete({ isOpen: false, patientId: '', patientName: '' });
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir aluno');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleUpdatePatient = async (input: CreatePatientInput) => {
    if (!editingPatient) return;
    setIsLoading(true);
    try {
      await patientsService.updatePatient(editingPatient.id, input);
      setEditingPatient(null);
      setShowPatientForm(false);
      await loadPatients();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!currentUser) {
    return (
      <>
        {authPage === 'login' ? (
          <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setAuthPage('signup')} />
        ) : (
          <Signup onSignupSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthPage('login')} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="PilatesControl"
        subtitle={`Olá, ${currentUser.name}`}
        onLogout={handleLogout}
      />
      <Navigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as ActiveTab)} />

      {currentPage === 'main' && (
        <main className="max-w-6xl mx-auto p-4 md:p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="float-right text-red-700 hover:text-red-900"
                >
                  ✕
                </button>
              </div>
            )}

            {/* HOME TAB */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao PilatesControl</h2>
                  <p className="text-gray-600 mb-6">
                    Seu sistema de gerenciamento de alunos, evolução clínica e controle de mensalidades
                  </p>
                  <button
                    onClick={() => {
                      setShowPatientForm(true);
                      setEditingPatient(null);
                    }}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium inline-block"
                  >
                    Adicionar Novo Aluno
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Total de Alunos</p>
                    <p className="text-4xl font-bold text-teal-600 mt-2">{patients.length}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Alunos Ativos</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                      {patients.filter((p) => p.active).length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Alunos Inativos</p>
                    <p className="text-4xl font-bold text-red-600 mt-2">
                      {patients.filter((p) => !p.active).length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PATIENTS TAB */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h2>
                  <button
                    onClick={() => {
                      setShowPatientForm(true);
                      setEditingPatient(null);
                    }}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    Novo Aluno
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <input
                    type="text"
                    placeholder="Buscar por nome ou patologia..."
                    value={patientListSearchFilter}
                    onChange={(e) => setPatientListSearchFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => setPatientStatusFilter('all')}
                      className={`px-4 py-2 rounded-lg transition font-medium ${
                        patientStatusFilter === 'all'
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setPatientStatusFilter('active')}
                      className={`px-4 py-2 rounded-lg transition font-medium ${
                        patientStatusFilter === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Ativos
                    </button>
                    <button
                      onClick={() => setPatientStatusFilter('inactive')}
                      className={`px-4 py-2 rounded-lg transition font-medium ${
                        patientStatusFilter === 'inactive'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Inativos
                    </button>
                  </div>
                </div>

                {showPatientForm && (
                  <PatientForm
                    initialData={editingPatient || undefined}
                    onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}
                    isLoading={isLoading}
                    onCancel={() => {
                      setShowPatientForm(false);
                      setEditingPatient(null);
                    }}
                  />
                )}

                <PatientList
                  patients={patients}
                  onEdit={handleEditPatient}
                  onViewEvolutions={handleViewEvolutions}
                  onRemind={(patient) => openWhatsAppChat(patient.phone, patient.name, patient.payment_day)}
                  onDeactivate={handleDeactivatePatient}
                  onDelete={handleDeletePatient}
                  isLoading={isLoading}
                  searchFilter={patientListSearchFilter}
                  statusFilter={patientStatusFilter}
                />
              </div>
            )}

            {/* EVOLUTION TAB */}
            {activeTab === 'evolution' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Evoluções Clínicas</h2>
                <p className="text-gray-600">
                  Selecione um aluno para visualizar ou registrar sua evolução clínica
                </p>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Buscar por nome ou patologia..."
                      value={evolutionSearchFilter}
                      onChange={(e) => setEvolutionSearchFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
                    />
                  </div>

                  <h3 className="font-bold text-gray-900 mb-4">
                    {evolutionSearchFilter 
                      ? `Resultados (${patients.filter((p) => 
                          p.active &&
                          (p.name.toLowerCase().includes(evolutionSearchFilter.toLowerCase()) ||
                          p.pathology_focus.toLowerCase().includes(evolutionSearchFilter.toLowerCase()))
                        ).length})`
                      : `Alunos Ativos (${patients.filter(p => p.active).length})`
                    }
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {patients
                      .filter((p) => 
                        p.active &&
                        (p.name.toLowerCase().includes(evolutionSearchFilter.toLowerCase()) ||
                        p.pathology_focus.toLowerCase().includes(evolutionSearchFilter.toLowerCase()))
                      )
                      .map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => handleViewEvolutions(patient.id)}
                          className="text-left p-4 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-500 transition"
                        >
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.pathology_focus}</p>
                        </button>
                      ))}
                  </div>
                  {evolutionSearchFilter && patients.filter((p) => 
                    p.active &&
                    (p.name.toLowerCase().includes(evolutionSearchFilter.toLowerCase()) ||
                    p.pathology_focus.toLowerCase().includes(evolutionSearchFilter.toLowerCase()))
                  ).length === 0 && (
                    <p className="text-center text-gray-500 py-8">Nenhum aluno ativo encontrado</p>
                  )}
                </div>
              </div>
            )}
        </main>
      )}

      {currentPage === 'student-details' && selectedPatient && (
        <main className="max-w-6xl mx-auto p-4 md:p-6">
          <StudentDetailsPage
            patient={selectedPatient}
            onBack={() => {
              setSelectedPatient(null);
              setCurrentPage('main');
            }}
            onSaved={loadPatients}
          />
        </main>
      )}

      <ConfirmDialog
        isOpen={confirmDeactivate.isOpen}
        title={patients.find(p => p.id === confirmDeactivate.patientId)?.active ? 'Desativar Aluno' : 'Reativar Aluno'}
        message={patients.find(p => p.id === confirmDeactivate.patientId)?.active 
          ? `Tem certeza que deseja desativar ${confirmDeactivate.patientName}? O aluno sairá da tela de evoluções, mas você poderá visualizá-lo aqui em cor vermelha e todos os registros serão mantidos.`
          : `Tem certeza que deseja reativar ${confirmDeactivate.patientName}? O aluno voltará a aparecer na tela de evoluções.`
        }
        confirmText={patients.find(p => p.id === confirmDeactivate.patientId)?.active ? 'Desativar' : 'Reativar'}
        cancelText="Cancelar"
        isDestructive={patients.find(p => p.id === confirmDeactivate.patientId)?.active}
        isLoading={isLoading}
        onConfirm={handleConfirmDeactivation}
        onCancel={() => setConfirmDeactivate({ isOpen: false, patientId: '', patientName: '' })}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Excluir Aluno Permanentemente"
        message={`Tem certeza que deseja excluir ${confirmDelete.patientName}? TODOS os dados e histórico (evoluções, faltas, etc.) serão deletados permanentemente. Esta ação não pode ser desfeita!`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, patientId: '', patientName: '' })}
      />
    </div>
  );
};
