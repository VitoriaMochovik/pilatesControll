import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Patient, Evolution, CreatePatientInput, CreateEvolutionInput, OverduePatient, Falta, CreateFaltaInput } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente Supabase não configuradas');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ==================== PACIENTES ====================
export const patientsService = {
  async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Erro ao buscar pacientes: ${error.message}`);
    return data || [];
  },

  async getPatientById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        ...input,
        paid_this_month: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar paciente: ${error.message}`);
    return data;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('students')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar paciente: ${error.message}`);
    return data;
  },

  async updatePaymentStatus(id: string, paid_this_month: boolean): Promise<Patient> {
    return this.updatePatient(id, { paid_this_month });
  },

  async deletePatient(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao deletar paciente: ${error.message}`);
  },

  async deactivatePatient(id: string): Promise<Patient> {
    return this.updatePatient(id, { active: false });
  },

  async reactivatePatient(id: string): Promise<Patient> {
    return this.updatePatient(id, { active: true });
  },

  async getOverduePatients(): Promise<OverduePatient[]> {
    const today = new Date();
    const currentDay = today.getDate();

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('paid_this_month', false);

    if (error) throw new Error(`Erro ao buscar pacientes inadimplentes: ${error.message}`);

    return (data || [])
      .filter((patient: Patient) => patient.payment_day < currentDay)
      .map((patient: Patient) => ({
        ...patient,
        dias_atrasados: currentDay - patient.payment_day,
      }));
  },
};

// ==================== EVOLUÇÕES ====================
export const evolutionsService = {
  async getEvolutionsByPatient(student_id: string): Promise<Evolution[]> {
    const { data, error } = await supabase
      .from('evolutions')
      .select('*')
      .eq('student_id', student_id)
      .order('date', { ascending: false });

    if (error) throw new Error(`Erro ao buscar evoluções: ${error.message}`);
    return data || [];
  },

  async createEvolution(input: CreateEvolutionInput): Promise<Evolution> {
    const { data, error } = await supabase
      .from('evolutions')
      .insert([{
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar evolução: ${error.message}`);
    return data;
  },

  async updateEvolution(id: string, updates: Partial<Evolution>): Promise<Evolution> {
    const { data, error } = await supabase
      .from('evolutions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar evolução: ${error.message}`);
    return data;
  },

  async deleteEvolution(id: string): Promise<void> {
    const { error } = await supabase
      .from('evolutions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao deletar evolução: ${error.message}`);
  },
};

// ==================== FALTAS ====================
export const faltasService = {
  async getFaltasByPatient(student_id: string): Promise<Falta[]> {
    const { data, error } = await supabase
      .from('absences')
      .select('*')
      .eq('student_id', student_id)
      .order('date', { ascending: false });

    if (error) throw new Error(`Erro ao buscar faltas: ${error.message}`);
    return data || [];
  },

  async createFalta(input: CreateFaltaInput): Promise<Falta> {
    const { data, error } = await supabase
      .from('absences')
      .insert([{
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao registrar falta: ${error.message}`);
    return data;
  },

  async updateFalta(id: string, updates: Partial<Falta>): Promise<Falta> {
    const { data, error } = await supabase
      .from('absences')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar falta: ${error.message}`);
    return data;
  },

  async deleteFalta(id: string): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao deletar falta: ${error.message}`);
  },
};
