-- ============================================================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE POSTGRESQL MULTI-TENANT
-- Plateforme SaaS de Gestion Scolaire (Sénégal & Afrique Francophone)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES DES ÉTABLISSEMENTS ET DE LA PLATEFORME
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    logo TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT DEFAULT 'Sénégal',
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT UNIQUE NOT NULL,
    website TEXT,
    school_types TEXT[] DEFAULT '{"Primaire", "Collège", "Lycée"}',
    headmaster TEXT NOT NULL,
    current_academic_year_id UUID,
    primary_color TEXT DEFAULT '#0284c7',
    currency TEXT DEFAULT 'FCFA',
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRIAL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ROLES ET PERMISSIONS DES UTILISATEURS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'DIRECTEUR', 'ADMIN', 'SECRETAIRE', 'COMPTABLE', 'ENSEIGNANT', 'SURVEILLANT', 'PARENT', 'ELEVE')),
    phone TEXT,
    active BOOLEAN DEFAULT TRUE,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ANNÉES ET PÉRIODES SCOLAIRES
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL, -- ex: "2025-2026"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED'))
);

CREATE TABLE IF NOT EXISTS public.academic_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- ex: "Trimestre 1"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    weight NUMERIC(3, 2) DEFAULT 1.0
);

-- 4. NIVEAUX ET CLASSES
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    label TEXT NOT NULL -- ex: "Primaire", "Collège", "Lycée"
);

CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- ex: "CM2 A"
    max_capacity INTEGER DEFAULT 40,
    main_teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 5. ÉLÈVES ET HISTORIQUE D'INSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    matricule TEXT UNIQUE NOT NULL, -- ELV-2026-00001
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth TEXT NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    photo TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'INSCRIT' CHECK (status IN ('INSCRIT', 'PREINSCRIT', 'PARTI', 'SUSPENDU')),
    parent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PASSED', 'FAILED', 'TRANSFERRED')),
    enrollment_date DATE DEFAULT CURRENT_DATE
);

-- 6. ENSEIGNANTS ET MATIÈRES
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    default_coefficient NUMERIC(3, 1) DEFAULT 1.0
);

CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL
);

-- 7. ÉVALUATIONS ET NOTES
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_period_id UUID REFERENCES public.academic_periods(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    evaluation_type TEXT CHECK (evaluation_type IN ('DEVOIR', 'COMPOSITION', 'INTERROGATION', 'EXAMEN')),
    date DATE NOT NULL,
    max_mark NUMERIC(5, 2) DEFAULT 20.0,
    coefficient NUMERIC(3, 1) DEFAULT 1.0
);

CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    mark NUMERIC(5, 2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PRÉSENCE ET RETARDS
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time TIME DEFAULT CURRENT_TIME,
    status TEXT CHECK (status IN ('PRESENT', 'ABSENT', 'EXCUSED', 'RETARD')),
    duration_minutes INTEGER DEFAULT 0,
    reason TEXT,
    recorded_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 9. COMPTABILITÉ ET PAIEMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    month TEXT NOT NULL, -- ex: "Octobre 2025"
    date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT CHECK (payment_method IN ('WAVE', 'ORANGE_MONEY', 'CASH', 'CHEQUE', 'BANK_TRANSFER')),
    reference TEXT NOT NULL,
    status TEXT DEFAULT 'REGLE' CHECK (status IN ('REGLE', 'PARTIEL', 'EN_ATTENTE', 'EN_RETARD', 'EXONERE')),
    recorded_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 10. PREINSCRIPTIONS PUBLIQUES & FORMULAIRE QR
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    candidate_first_name TEXT NOT NULL,
    candidate_last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth TEXT NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    requested_class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. AUDIT & SAAS SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES POWERS MULTI-TENANCY ISOLATION
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Dynamic tenant isolation policy template
CREATE POLICY school_isolation_policy ON public.students
    USING (school_id = (auth.jwt() ->> 'school_id')::uuid);
