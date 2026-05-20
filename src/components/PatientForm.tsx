import React, { useState } from 'react';
import { CreatePatientInput, Patient } from '../types';

interface PatientFormProps {
  onSubmit: (input: CreatePatientInput) => Promise<void>;
  initialData?: Patient;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreatePatientInput>({
    name: initialData?.name || '',
    age: initialData?.age || 0,
    pathology_focus: initialData?.pathology_focus || '',
    phone: initialData?.phone || '',
    payment_day: initialData?.payment_day || 1,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'payment_day' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.age || !formData.pathology_focus || !formData.phone) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.payment_day < 1 || formData.payment_day > 28) {
      setError('O dia de vencimento deve estar entre 1 e 28');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        age: 0,
        pathology_focus: '',
        phone: '',
        payment_day: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aluno');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="João Silva"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idade *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleChange}
            placeholder="30"
            min="1"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foco da Patologia *
          </label>
          <input
            type="text"
            name="pathology_focus"
            value={formData.pathology_focus}
            onChange={handleChange}
            placeholder="Dor nas costas, Escoliose, etc"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular/WhatsApp *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dia de Vencimento (1-28) *
          </label>
          <input
            type="number"
            name="payment_day"
            value={formData.payment_day || ''}
            onChange={handleChange}
            min="1"
            max="28"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:bg-gray-400"
        >
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Adicionar Aluno'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
