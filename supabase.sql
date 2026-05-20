-- Supabase SQL Script - PilatesControl Database (Complete English Schema)
-- Execute this entire script in the Supabase SQL Editor

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS professor_students CASCADE;
DROP TABLE IF EXISTS absences CASCADE;
DROP TABLE IF EXISTS evolutions CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS professors CASCADE;

-- Create professors table
CREATE TABLE professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  specialty VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  pathology_focus VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  payment_day INTEGER NOT NULL CHECK (payment_day >= 1 AND payment_day <= 28),
  paid_this_month BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create evolutions table
CREATE TABLE evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create absences table
CREATE TABLE absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create professor-student association table
CREATE TABLE professor_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(professor_id, student_id)
);

-- Create indices for better performance
CREATE INDEX idx_professors_email ON professors(email);
CREATE INDEX idx_professors_created_at ON professors(created_at);

CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_active ON students(active);
CREATE INDEX idx_students_payment_day ON students(payment_day);
CREATE INDEX idx_students_paid_this_month ON students(paid_this_month);

CREATE INDEX idx_evolutions_student_id ON evolutions(student_id);
CREATE INDEX idx_evolutions_date ON evolutions(date DESC);

CREATE INDEX idx_absences_student_id ON absences(student_id);
CREATE INDEX idx_absences_date ON absences(date DESC);

CREATE INDEX idx_professor_students_professor ON professor_students(professor_id);
CREATE INDEX idx_professor_students_student ON professor_students(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (for development)
-- ⚠️ IMPORTANT: In production, implement authentication and more restrictive policies

-- Professors policies
DROP POLICY IF EXISTS "Allow public read on professors" ON professors;
CREATE POLICY "Allow public read on professors" 
  ON professors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on professors" ON professors;
CREATE POLICY "Allow public insert on professors" 
  ON professors FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on professors" ON professors;
CREATE POLICY "Allow public update on professors" 
  ON professors FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on professors" ON professors;
CREATE POLICY "Allow public delete on professors" 
  ON professors FOR DELETE USING (true);

-- Students policies
DROP POLICY IF EXISTS "Allow public read on students" ON students;
CREATE POLICY "Allow public read on students" 
  ON students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on students" ON students;
CREATE POLICY "Allow public insert on students" 
  ON students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on students" ON students;
CREATE POLICY "Allow public update on students" 
  ON students FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on students" ON students;
CREATE POLICY "Allow public delete on students" 
  ON students FOR DELETE USING (true);

-- Evolutions policies
DROP POLICY IF EXISTS "Allow public read on evolutions" ON evolutions;
CREATE POLICY "Allow public read on evolutions" 
  ON evolutions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on evolutions" ON evolutions;
CREATE POLICY "Allow public insert on evolutions" 
  ON evolutions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on evolutions" ON evolutions;
CREATE POLICY "Allow public update on evolutions" 
  ON evolutions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on evolutions" ON evolutions;
CREATE POLICY "Allow public delete on evolutions" 
  ON evolutions FOR DELETE USING (true);

-- Absences policies
DROP POLICY IF EXISTS "Allow public read on absences" ON absences;
CREATE POLICY "Allow public read on absences" 
  ON absences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on absences" ON absences;
CREATE POLICY "Allow public insert on absences" 
  ON absences FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on absences" ON absences;
CREATE POLICY "Allow public update on absences" 
  ON absences FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on absences" ON absences;
CREATE POLICY "Allow public delete on absences" 
  ON absences FOR DELETE USING (true);

-- Professor-Students policies
DROP POLICY IF EXISTS "Allow public read on professor_students" ON professor_students;
CREATE POLICY "Allow public read on professor_students" 
  ON professor_students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on professor_students" ON professor_students;
CREATE POLICY "Allow public insert on professor_students" 
  ON professor_students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on professor_students" ON professor_students;
CREATE POLICY "Allow public update on professor_students" 
  ON professor_students FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on professor_students" ON professor_students;
CREATE POLICY "Allow public delete on professor_students" 
  ON professor_students FOR DELETE USING (true);

-- Sample data (optional)
INSERT INTO students (name, age, pathology_focus, phone, payment_day, paid_this_month, active) VALUES
  ('João Silva', 35, 'Back pain', '11987654321', 10, true, true),
  ('Maria Santos', 28, 'Scoliosis', '11912345678', 15, false, true),
  ('Pedro Oliveira', 42, 'Knee injury', '11956789012', 5, true, true),
  ('Ana Costa', 31, 'Disc herniation', '11934567890', 20, false, true),
  ('Carlos Rodrigues', 55, 'Arthritis', '11923456789', 8, true, true);
