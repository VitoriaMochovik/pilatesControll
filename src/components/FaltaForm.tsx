import React, { useState } from 'react';
import { CreateFaltaInput } from '../types';

interface FaltaFormProps {
  patientName: string;
  initialData?: CreateFaltaInput;
  onSubmit: (date: CreateFaltaInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FaltaForm: React.FC<FaltaFormProps> = ({
  patientName,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<CreateFaltaInput>(
    initialData || {
      student_id: '',
      date: today,
      reason: '',
    }
  );

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({
        student_id: '',
        date: today,
        reason: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar falta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lançar Falta</h2>
          <p className="text-gray-600 mt-1">Paciente: <strong>{patientName}</strong></p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da Falta *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Motivo da Falta (Opcional)
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Justificativa ou observações sobre a falta"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:bg-gray-400"
        >
          {isLoading ? 'Registrando...' : 'Registrar Falta'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
