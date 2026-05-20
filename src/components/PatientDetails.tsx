import React, { useState, useEffect } from 'react';
import { Patient, Evolution, Falta } from '../types';
import { evolutionsService, faltasService } from '../services/supabase';
import { formatDate } from '../utils/helpers';

interface PatientDetailsProps {
  patient: Patient;
  onClose: () => void;
  onEvolutionSaved: () => void;
  onAddEvolution?: () => void;
  onAddFalta?: () => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  onClose,
  onEvolutionSaved,
  onAddEvolution,
  onAddFalta,
}) => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'evolutions' | 'faltas'>('evolutions');

  useEffect(() => {
    loadData();
  }, [patient.id]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [evolutionsData, faltasData] = await Promise.all([
        evolutionsService.getEvolutionsByPatient(patient.id),
        faltasService.getFaltasByPatient(patient.id),
      ]);
      setEvolutions(evolutionsData);
      setFaltas(faltasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="text-teal-100">Detalhes e Registros</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info do Paciente */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
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

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onAddEvolution}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Lançar Evolução
            </button>
            <button
              onClick={onAddFalta}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Lançar Falta
            </button>
          </div>

          {/* Abas de Histórico */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('evolutions')}
                className={`px-4 py-2 border-b-2 transition ${
                  activeTab === 'evolutions'
                    ? 'border-teal-600 text-teal-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Evoluções ({evolutions.length})
              </button>
              <button
                onClick={() => setActiveTab('faltas')}
                className={`px-4 py-2 border-b-2 transition ${
                  activeTab === 'faltas'
                    ? 'border-red-600 text-red-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Faltas ({faltas.length})
              </button>
            </div>
          </div>

          {/* Histórico de Evoluções */}
          {activeTab === 'evolutions' && (
            <div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {isLoading ? (
                <p className="text-gray-600 text-center py-8">Carregando...</p>
              ) : evolutions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Nenhuma evolução registrada</p>
              ) : (
                <div className="space-y-3">
                  {evolutions.map((evolution) => (
                    <div key={evolution.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-900">
                          {formatDate(evolution.date)}
                        </p>
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja deletar esta evolução?')) {
                              evolutionsService.deleteEvolution(evolution.id).then(() => {
                                loadData();
                              });
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Deletar
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{evolution.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Histórico de Faltas */}
          {activeTab === 'faltas' && (
            <div>
              {isLoading ? (
                <p className="text-gray-600 text-center py-8">Carregando...</p>
              ) : faltas.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Nenhuma falta registrada</p>
              ) : (
                <div className="space-y-3">
                  {faltas.map((falta) => (
                    <div key={falta.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-900">
                          {formatDate(falta.date)}
                        </p>
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja deletar esta falta?')) {
                              faltasService.deleteFalta(falta.id).then(() => {
                                loadData();
                              });
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Deletar
                        </button>
                      </div>
                      {falta.reason && (
                        <p className="text-gray-700 whitespace-pre-wrap">{falta.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
