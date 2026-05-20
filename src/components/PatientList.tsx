import React from 'react';
import { Patient } from '../types';
import { PatientCard } from './PatientCard';

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onViewEvolutions: (patientId: string) => void;
  onRemind: (patient: Patient) => void;
  onDeactivate: (patientId: string, patientName: string) => void;
  onDelete: (patientId: string, patientName: string) => void;
  isLoading?: boolean;
  searchFilter?: string;
  statusFilter?: 'all' | 'active' | 'inactive';
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onEdit,
  onViewEvolutions,
  onRemind,
  onDeactivate,
  onDelete,
  isLoading = false,
  searchFilter = '',
  statusFilter = 'all',
}) => {
  const filteredPatients = patients.filter((p) => {
    // Filtro de nome/patologia
    const matchesSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.pathology_focus.toLowerCase().includes(searchFilter.toLowerCase());

    // Filtro de status
    if (statusFilter === 'active') return matchesSearch && p.active;
    if (statusFilter === 'inactive') return matchesSearch && !p.active;
    return matchesSearch; // 'all'
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Carregando alunos...</p>
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">Nenhum aluno encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPatients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onEdit={onEdit}
          onViewEvolutions={onViewEvolutions}
          onRemind={onRemind}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
