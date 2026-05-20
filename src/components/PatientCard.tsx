import React from 'react';
import { Patient } from '../types';

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onViewEvolutions: (patientId: string) => void;
  onRemind: (patient: Patient) => void;
  onDeactivate: (patientId: string, patientName: string) => void;
  onDelete: (patientId: string, patientName: string) => void;
  isOverdue?: boolean;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  onViewEvolutions,
  onRemind,
  onDeactivate,
  onDelete,
  isOverdue = false,
}) => {

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${
      !patient.active ? 'border-red-500 opacity-75' : 'border-teal-500'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${!patient.active ? 'text-red-700' : 'text-gray-900'}`}>
            {patient.name}
            {!patient.active && <span className="ml-2 text-sm text-red-600">(Inativo)</span>}
          </h3>
          <p className="text-gray-600">{patient.phone}</p>
          <p className="text-gray-600">{patient.pathology_focus}</p>
          <p className="text-sm text-gray-500 mt-2">
            Idade: {patient.age} | Vencimento: dia {patient.payment_day}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {patient.active && (
              <button
                onClick={() => onRemind(patient)}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                Lembrar
              </button>
            )}
            <button
              onClick={() => onViewEvolutions(patient.id)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
            >
              {patient.active ? 'Evolução' : 'Histórico'}
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDeactivate(patient.id, patient.name)}
              className={`px-3 py-1 text-sm rounded transition ${
                patient.active
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {patient.active ? 'Desativar' : 'Reativar'}
            </button>
            {!patient.active && (
              <button
                onClick={() => onDelete(patient.id, patient.name)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
