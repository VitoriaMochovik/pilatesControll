export interface Patient {
  id: string;
  name: string;
  age: number;
  pathology_focus: string;
  phone: string;
  payment_day: number;
  paid_this_month: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Evolution {
  id: string;
  student_id: string;
  date: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface Falta {
  id: string;
  student_id: string;
  date: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientInput {
  name: string;
  age: number;
  pathology_focus: string;
  phone: string;
  payment_day: number;
  active?: boolean;
}

export interface CreateEvolutionInput {
  student_id: string;
  date: string;
  text: string;
}

export interface CreateFaltaInput {
  student_id: string;
  date: string;
  reason?: string;
}

export interface OverduePatient extends Patient {
  dias_atrasados: number;
}

export interface Professor {
  id: string;
  email: string;
  name: string;
  phone?: string;
  specialty?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfessorInput {
  email: string;
  name: string;
  phone?: string;
  specialty?: string;
  password: string;
}

export interface ProfessorPaciente {
  id: string;
  professor_id: string;
  student_id: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
