import React, { useState, useEffect } from 'react';
import { Patient, Evolution, Falta, CreateEvolutionInput, CreateFaltaInput } from '../types';
import { evolutionsService, faltasService } from '../services/supabase';
import { formatDate } from '../utils/helpers';
import { EvolutionForm } from '../components/EvolutionForm';
import { FaltaForm } from '../components/FaltaForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { pdfService } from '../services/pdfService';

interface StudentDetailsPageProps {
  patient: Patient;
  onBack: () => void;
  onSaved: () => void;
}

export const StudentDetailsPage: React.FC<StudentDetailsPageProps> = ({
  patient,
  onBack,
  onSaved,
}) => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<'evolutions' | 'faltas'>('evolutions');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState<null | 'evolution' | 'falta'>(null);
  const [editingEvolution, setEditingEvolution] = useState<Evolution | null>(null);
  const [editingFalta, setEditingFalta] = useState<Falta | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'evolution' | 'falta';
    id: string;
  }>({ isOpen: false, type: 'evolution', id: '' });

  useEffect(() => {
    loadHistory();
  }, [patient.id]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const [evs, fts] = await Promise.all([
        evolutionsService.getEvolutionsByPatient(patient.id),
        faltasService.getFaltasByPatient(patient.id),
      ]);
      setEvolutions(evs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setFaltas(fts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvolution = () => {
    setEditingEvolution(null);
    setShowForm('evolution');
  };

  const handleAddFalta = () => {
    setEditingFalta(null);
    setShowForm('falta');
  };

  const handleEditEvolution = (evolution: Evolution) => {
    setEditingEvolution(evolution);
    setShowForm('evolution');
  };

  const handleEditFalta = (falta: Falta) => {
    setEditingFalta(falta);
    setShowForm('falta');
  };

  const handleDeleteEvolution = (evolutionId: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'evolution',
      id: evolutionId,
    });
  };

  const handleDeleteFalta = (faltaId: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'falta',
      id: faltaId,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setFormLoading(true);
      if (confirmDialog.type === 'evolution') {
        await evolutionsService.deleteEvolution(confirmDialog.id);
      } else {
        await faltasService.deleteFalta(confirmDialog.id);
      }
      setConfirmDialog({ isOpen: false, type: 'evolution', id: '' });
      await loadHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEvolutionSubmit = async (input: CreateEvolutionInput) => {
    setFormLoading(true);
    try {
      if (editingEvolution) {
        await evolutionsService.updateEvolution(editingEvolution.id, input);
      } else {
        await evolutionsService.createEvolution({
          ...input,
          student_id: patient.id,
        });
      }
      setShowForm(null);
      setEditingEvolution(null);
      await loadHistory();
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFaltaSubmit = async (input: CreateFaltaInput) => {
    setFormLoading(true);
    try {
      if (editingFalta) {
        await faltasService.updateFalta(editingFalta.id, input);
      } else {
        await faltasService.createFalta({
          ...input,
          student_id: patient.id,
        });
      }
      setShowForm(null);
      setEditingFalta(null);
      await loadHistory();
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredEvolutions = dateFilter
    ? evolutions.filter((e) => e.date.startsWith(dateFilter))
    : evolutions;

  const filteredFaltas = dateFilter
    ? faltas.filter((f) => f.date.startsWith(dateFilter))
    : faltas;

  const handleExportPDF = async () => {
    try {
      setFormLoading(true);
      await pdfService.exportPDF(patient, evolutions, faltas);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Título com voltar */}
      <div>
        <button
          onClick={onBack}
          className="text-teal-600 hover:text-teal-700 font-semibold transition mb-2"
        >
          ← Voltar
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
          {!patient.active && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              Inativo
            </span>
          )}
        </div>
      </div>

      {/* Info do Paciente */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Informações do Aluno</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Idade</p>
            <p className="text-lg font-semibold text-gray-900">{patient.age} anos</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Patologia</p>
            <p className="text-lg font-semibold text-gray-900">{patient.pathology_focus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Contato</p>
            <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vencimento</p>
            <p className="text-lg font-semibold text-gray-900">Dia {patient.payment_day}</p>
          </div>
        </div>
      </div>

      {/* Botões de Ação Simples */}
      {patient.active && (
        <div className="flex gap-3">
          <button
            onClick={handleAddEvolution}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
          >
            Lançar Evolução
          </button>
          <button
            onClick={handleAddFalta}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Lançar Falta
          </button>
        </div>
      )}

      {!patient.active && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">
            Este aluno está inativo. Você pode visualizar o histórico, mas não é possível registrar novas evoluções ou faltas.
          </p>
        </div>
      )}

      {/* Formulário de Evolução */}
      {showForm === 'evolution' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {editingEvolution ? 'Editar Evolução' : 'Registrar Evolução Clínica'}
          </h3>
          <EvolutionForm
            patientName={patient.name}
            initialData={
              editingEvolution
                ? {
                    student_id: patient.id,
                    date: editingEvolution.date,
                    text: editingEvolution.text,
                  }
                : undefined
            }
            onSubmit={handleEvolutionSubmit}
            onCancel={() => {
              setShowForm(null);
              setEditingEvolution(null);
            }}
          />
        </div>
      )}

      {/* Formulário de Falta */}
      {showForm === 'falta' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {editingFalta ? 'Editar Falta' : 'Registrar Falta'}
          </h3>
          <FaltaForm
            patientName={patient.name}
            initialData={
              editingFalta
                ? {
                    student_id: patient.id,
                    date: editingFalta.date,
                    reason: editingFalta.reason || '',
                  }
                : undefined
            }
            onSubmit={handleFaltaSubmit}
            onCancel={() => {
              setShowForm(null);
              setEditingFalta(null);
            }}
          />
        </div>
      )}

      {/* Histórico */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Histórico</h3>

        {/* Filtros e Exportar */}
        <div className="flex gap-3 items-end mb-6 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('evolutions')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'evolutions'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Evoluções ({evolutions.length})
            </button>
            <button
              onClick={() => setFilterType('faltas')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'faltas'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Faltas ({faltas.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-sm"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleExportPDF}
            disabled={formLoading}
            className="ml-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50"
          >
            {formLoading ? 'Gerando...' : 'Exportar PDF'}
          </button>
        </div>

        {/* Conteúdo */}
        {isLoading ? (
          <p className="text-gray-600">Carregando histórico...</p>
        ) : filterType === 'evolutions' ? (
          <div className="space-y-3">
            {filteredEvolutions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma evolução registrada</p>
            ) : (
              filteredEvolutions.map((evolution) => (
                <div key={evolution.id} className="border-l-4 border-teal-600 bg-teal-50 p-4 rounded flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-teal-600 font-semibold">{formatDate(evolution.date)}</p>
                    <p className="text-gray-900 mt-2">{evolution.text}</p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleEditEvolution(evolution)}
                      className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEvolution(evolution.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaltas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma falta registrada</p>
            ) : (
              filteredFaltas.map((falta) => (
                <div key={falta.id} className="border-l-4 border-red-600 bg-red-50 p-4 rounded flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-red-600 font-semibold">{formatDate(falta.date)}</p>
                    {falta.reason && <p className="text-gray-900 mt-2">{falta.reason}</p>}
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleEditFalta(falta)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteFalta(falta.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition opacity-70"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'evolution' ? 'Excluir Evolução' : 'Excluir Falta'}
        message={
          confirmDialog.type === 'evolution'
            ? 'Tem certeza que deseja excluir esta evolução? Esta ação não pode ser desfeita.'
            : 'Tem certeza que deseja excluir esta falta? Esta ação não pode ser desfeita.'
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
        isLoading={formLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'evolution', id: '' })}
      />
    </div>
  );
};
