import React from 'react';
import { Patient, OverduePatient } from '../types';
import { PatientCard } from './PatientCard';

interface OverduePatientsProps {
  patients: OverduePatient[];
  onEdit: (patient: Patient) => void;
  onViewEvolutions: (patientId: string) => void;
  onRemind: (patient: Patient) => void;
  onDeactivate: (patientId: string, patientName: string) => void;
  onDelete: (patientId: string, patientName: string) => void;
  isLoading?: boolean;
}

export const OverduePatients: React.FC<OverduePatientsProps> = ({
  patients,
  onEdit,
  onViewEvolutions,
  onRemind,
  onDeactivate,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-8 text-center">
        <p className="text-teal-700 font-medium text-lg">Todos os alunos estão em dia!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">
          {patients.length} aluno(s) com pagamento atrasado
        </p>
      </div>
      {patients.map((patient) => (
        <div key={patient.id}>
          <PatientCard
            patient={patient}
            onEdit={onEdit}
            onViewEvolutions={onViewEvolutions}
            onRemind={onRemind}
            onDeactivate={onDeactivate}
            onDelete={onDelete}
            isOverdue={true}
          />
        </div>
      ))}
    </div>
  );
};
