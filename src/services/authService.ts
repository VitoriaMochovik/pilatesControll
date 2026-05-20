import { supabase } from './supabase';
import { Professor, CreateProfessorInput, AuthUser } from '../types';

export const authService = {
  async signup(input: CreateProfessorInput): Promise<{ user: AuthUser; professor: Professor }> {
    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (authError) throw new Error(`Erro ao criar usuário: ${authError.message}`);
    if (!authData.user) throw new Error('Erro ao criar usuário');

    // Small delay to ensure user is fully created in auth
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Create professor record
    const professorRecord = {
      id: authData.user.id,
      email: input.email,
      name: input.name,
      phone: input.phone || null,
      specialty: input.specialty || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: professorData, error: professorError } = await supabase
      .from('professors')
      .insert([professorRecord])
      .select()
      .single();

    if (professorError) {
      console.error('Professor creation error:', professorError);
      throw new Error(`Erro ao criar professor: ${professorError.message}`);
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email || input.email,
        name: input.name,
      },
      professor: professorData,
    };
  },

  async login(email: string, password: string): Promise<{ user: AuthUser; professor: Professor }> {
    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(`Email ou senha incorretos: ${authError.message}`);
    if (!authData.user) throw new Error('Erro ao fazer login');

    // 2. Get professor data
    const { data: professorData, error: professorError } = await supabase
      .from('professors')
      .select('*')
      .eq('id', authData.user.id);

    if (professorError || !professorData || professorData.length === 0) {
      throw new Error('Erro ao buscar dados do professor');
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        name: professorData[0].name,
      },
      professor: professorData[0],
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Erro ao fazer logout: ${error.message}`);
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return null;

      const { data: professorData, error } = await supabase
        .from('professors')
        .select('name')
        .eq('id', authUser.id);

      // Se houver erro ou sem dados, retorna com email como fallback
      if (error || !professorData || professorData.length === 0) {
        return {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.email?.split('@')[0] || 'Usuário',
        };
      }

      return {
        id: authUser.id,
        email: authUser.email || '',
        name: professorData[0].name || '',
      };
    } catch {
      return null;
    }
  },

  async getProfessorPatients(professorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('professor_students')
      .select('student_id')
      .eq('professor_id', professorId);

    if (error) throw new Error(`Erro ao buscar alunos: ${error.message}`);
    return (data || []).map(item => item.student_id);
  },

  async addPatientToProfessor(professorId: string, patientId: string): Promise<void> {
    const { error } = await supabase
      .from('professor_students')
      .insert([
        {
          professor_id: professorId,
          student_id: patientId,
        },
      ]);

    if (error) throw new Error(`Erro ao adicionar aluno: ${error.message}`);
  },

  async removePatientFromProfessor(professorId: string, patientId: string): Promise<void> {
    const { error } = await supabase
      .from('professor_students')
      .delete()
      .eq('professor_id', professorId)
      .eq('student_id', patientId);

    if (error) throw new Error(`Erro ao remover aluno: ${error.message}`);
  },
};
