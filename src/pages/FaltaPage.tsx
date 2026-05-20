import React from 'react';
import { Patient, CreateFaltaInput } from '../types';
import { faltasService } from '../services/supabase';
import { FaltaForm } from '../components/FaltaForm';

interface FaltaPageProps {
  patient: Patient;
  onBack: () => void;
  onSaved: () => void;
}

export const FaltaPage: React.FC<FaltaPageProps> = ({
  patient,
  onBack,
  onSaved,
}) => {
  const handleSubmit = async (date: CreateFaltaInput) => {
    try {
      await faltasService.createFalta({
        ...date,
        student_id: patient.id,
      });
      onSaved();
      onBack();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg">
        <button
          onClick={onBack}
          className="text-2xl hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center mb-4"
        >
          ← Voltar
        </button>
        <div>
          <h1 className="text-3xl font-bold">Registrar Falta</h1>
          <p className="text-teal-100 mt-2">Paciente: <strong>{patient.name}</strong></p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <FaltaForm
            patientName={patient.name}
            onSubmit={handleSubmit}
            onCancel={onBack}
          />
        </div>

        {/* Info do Paciente */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações do Paciente</h2>
          <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};
