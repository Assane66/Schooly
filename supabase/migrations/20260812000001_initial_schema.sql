-- ============================================================================
-- Migration 001 — Schéma complet plateforme SaaS de Gestion Scolaire Multi-Tenant
-- Projet Supabase : Schooly (ljvnnpwwmhzdctvflsxb)
-- Date : 2026-08-12
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ÉTABLISSEMENTS (MULTI-TENANT CORE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    logo TEXT,
    address TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT 'Dakar',
    country TEXT DEFAULT 'Sénégal',
    phone TEXT NOT NULL DEFAULT '',
    whatsapp TEXT,
    email TEXT UNIQUE NOT NULL,
    website TEXT,
    school_types TEXT[] DEFAULT '{}',
    headmaster TEXT NOT NULL DEFAULT '',
    current_academic_year_id UUID,
    primary_color TEXT DEFAULT '#0284c7',
    currency TEXT DEFAULT 'FCFA',
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRIAL')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 2. UTILISATEURS (Directeurs, Enseignants, Parents, Élèves, Comptables...)
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 3. PLANS & ABONNEMENTS SAAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price_fcfa INTEGER NOT NULL,
    max_students INTEGER NOT NULL,
    max_users INTEGER NOT NULL,
    max_classes INTEGER NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'TRIAL' CHECK (status IN ('TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    student_limit INTEGER DEFAULT 150,
    used_students INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 4. ANNÉES ET PÉRIODES SCOLAIRES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.academic_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    period_type TEXT DEFAULT 'TRIMESTRE' CHECK (period_type IN ('TRIMESTRE', 'SEMESTRE', 'PERSONNALISE')),
    weight NUMERIC(3,2) DEFAULT 1.0
);

-- ============================================================================
-- 5. NIVEAUX ET CLASSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    max_capacity INTEGER DEFAULT 40,
    main_teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 6. ÉLÈVES (identité permanente, indépendante des inscriptions annuelles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    matricule TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth TEXT NOT NULL DEFAULT '',
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    photo TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'INSCRIT' CHECK (status IN ('INSCRIT', 'PREINSCRIT', 'PARTI', 'SUSPENDU')),
    parent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 7. INSCRIPTIONS ANNUELLES (historique scolaire complet)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PASSED', 'FAILED', 'TRANSFERRED', 'WITHDRAWN')),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, academic_year_id)
);

-- ============================================================================
-- 8. PARENTS ET ASSOCIATION PARENT → ÉLÈVE(S)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    occupation TEXT
);

CREATE TABLE IF NOT EXISTS public.parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    relationship TEXT DEFAULT 'parent',
    UNIQUE(parent_id, student_id)
);

-- ============================================================================
-- 9. MATIÈRES ET AFFECTATION DES ENSEIGNANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    default_coefficient NUMERIC(3,1) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(teacher_id, subject_id, class_id, academic_year_id)
);

-- ============================================================================
-- 10. ÉVALUATIONS ET NOTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_period_id UUID REFERENCES public.academic_periods(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    evaluation_type TEXT CHECK (evaluation_type IN ('DEVOIR', 'COMPOSITION', 'INTERROGATION', 'EXAMEN', 'CONTROLE')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    max_mark NUMERIC(5,2) DEFAULT 20.0,
    coefficient NUMERIC(3,1) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    mark NUMERIC(5,2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(evaluation_id, student_id)
);

-- ============================================================================
-- 11. PRÉSENCE ET RETARDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TIME DEFAULT CURRENT_TIME,
    status TEXT CHECK (status IN ('PRESENT', 'ABSENT', 'EXCUSED', 'RETARD')) NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    reason TEXT,
    recorded_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 12. PAIEMENTS ET FRAIS SCOLAIRES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payment_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    month_label TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    month_label TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT CHECK (payment_method IN ('WAVE', 'ORANGE_MONEY', 'CASH', 'CHEQUE', 'BANK_TRANSFER', 'AUTRE')),
    reference TEXT NOT NULL,
    status TEXT DEFAULT 'REGLE' CHECK (status IN ('REGLE', 'PARTIEL', 'EN_ATTENTE', 'EN_RETARD', 'EXONERE')),
    recorded_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 13. PREINSCRIPTIONS PUBLIQUES (Lien / QR Code)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    candidate_first_name TEXT NOT NULL,
    candidate_last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth TEXT NOT NULL DEFAULT '',
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    photo TEXT,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    requested_class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMPTZ,
    processed_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 14. BULLETINS GÉNÉRÉS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_period_id UUID REFERENCES public.academic_periods(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    gpa NUMERIC(4,2),
    rank INTEGER,
    class_average NUMERIC(4,2),
    highest_gpa NUMERIC(4,2),
    lowest_gpa NUMERIC(4,2),
    absences_count INTEGER DEFAULT 0,
    lateness_count INTEGER DEFAULT 0,
    appreciation TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(student_id, academic_period_id)
);

-- ============================================================================
-- 15. CARTES SCOLAIRES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.student_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    card_code TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 16. CALENDRIER SCOLAIRE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    event_type TEXT DEFAULT 'AUTRE' CHECK (event_type IN ('EXAM', 'HOLIDAY', 'MEETING', 'REENTREE', 'SORTIE', 'COMPOSITION', 'AUTRE')),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 17. DOCUMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 18. NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 19. JOURNAL D'AUDIT (Section 43 du cahier des charges)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL DEFAULT '',
    user_role TEXT NOT NULL DEFAULT '',
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 20. INDEX DE PERFORMANCE MULTI-TENANT
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_students_school ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_matricule ON public.students(matricule);
CREATE INDEX IF NOT EXISTS idx_enrollments_school ON public.enrollments(school_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_school ON public.grades(school_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_school ON public.payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_school ON public.attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_registrations_school ON public.registrations(school_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_school ON public.activity_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school ON public.classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_year ON public.classes(academic_year_id);

-- ============================================================================
-- 21. ROW LEVEL SECURITY (Isolation stricte multi-écoles)
-- ============================================================================
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs authentifiés ne voient que les données de leur école
DROP POLICY IF EXISTS "school_isolation_students" ON public.students;
CREATE POLICY "school_isolation_students"
ON public.students FOR ALL
USING (school_id::text = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS "school_isolation_grades" ON public.grades;
CREATE POLICY "school_isolation_grades"
ON public.grades FOR ALL
USING (school_id::text = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS "school_isolation_payments" ON public.payments;
CREATE POLICY "school_isolation_payments"
ON public.payments FOR ALL
USING (school_id::text = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS "school_isolation_attendance" ON public.attendance;
CREATE POLICY "school_isolation_attendance"
ON public.attendance FOR ALL
USING (school_id::text = current_setting('app.current_school_id', true));

-- ============================================================================
-- 22. DONNÉES INITIALES — Plans SaaS
-- ============================================================================
INSERT INTO public.plans (name, price_fcfa, max_students, max_users, max_classes, features)
VALUES 
    ('Basic', 25000, 150, 5, 6, ARRAY['Gestion administrative & élèves', 'Inscriptions & Matricules automatiques', 'Bulletins simples PDF', 'Support par e-mail']),
    ('Standard', 55000, 500, 20, 20, ARRAY['Toutes les fonctions de Basic', 'Paiements & Reçus automatisés', 'Module Impayés & Relances', 'Présence & Retards', 'Cartes élèves QR', 'Support WhatsApp']),
    ('Premium', 120000, 2500, 100, 80, ARRAY['Toutes les fonctions de Standard', 'Espace Parents & Élèves', 'Import/Export Excel illimité', 'Bulletins personnalisés', 'Statistiques avancées', 'Onboarding dédié'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 23. DONNÉES INITIALES — École de démonstration (Sénégal)
-- ============================================================================
INSERT INTO public.schools (id, name, code, address, city, country, phone, whatsapp, email, school_types, headmaster, primary_color, currency, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Complexe Scolaire Excellence de Dakar',
    'EXCELLENCE-DKR',
    'Avenue Cheikh Anta Diop, Mermoz',
    'Dakar',
    'Sénégal',
    '+221 33 824 55 00',
    '+221 77 654 32 10',
    'contact@excellence-dakar.edu.sn',
    ARRAY['Primaire', 'Collège', 'Lycée'],
    'Dr. Ousmane Kane',
    '#0284c7',
    'FCFA',
    'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

-- Année scolaire 2025-2026
INSERT INTO public.academic_years (id, school_id, label, start_date, end_date, is_current, status)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    '2025-2026',
    '2025-10-01',
    '2026-07-15',
    TRUE,
    'ACTIVE'
)
ON CONFLICT DO NOTHING;

-- Trimestres
INSERT INTO public.academic_periods (id, school_id, academic_year_id, name, start_date, end_date, period_type)
VALUES 
    ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Trimestre 1', '2025-10-01', '2025-12-20', 'TRIMESTRE'),
    ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Trimestre 2', '2026-01-05', '2026-03-31', 'TRIMESTRE'),
    ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Trimestre 3', '2026-04-15', '2026-07-10', 'TRIMESTRE')
ON CONFLICT DO NOTHING;

-- Niveaux
INSERT INTO public.levels (id, school_id, code, label, sort_order)
VALUES 
    ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', 'PRI', 'Primaire', 1),
    ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000001', 'COL', 'Collège', 2),
    ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000001', 'LYC', 'Lycée', 3)
ON CONFLICT DO NOTHING;

-- Classes
INSERT INTO public.classes (id, school_id, level_id, academic_year_id, name, max_capacity)
VALUES 
    ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000010', 'CM2 A', 40),
    ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000010', '6ème B', 45),
    ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000010', '3ème A', 40),
    ('00000000-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000010', 'Terminale S2', 35)
ON CONFLICT DO NOTHING;

-- Matières
INSERT INTO public.subjects (id, school_id, level_id, code, name, default_coefficient)
VALUES
    ('00000000-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'FRA', 'Français & Littérature', 4.0),
    ('00000000-0000-0000-0000-000000000051', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'MATH', 'Mathématiques', 5.0),
    ('00000000-0000-0000-0000-000000000052', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'PC', 'Physique - Chimie', 3.0),
    ('00000000-0000-0000-0000-000000000053', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'ANG', 'Anglais', 3.0),
    ('00000000-0000-0000-0000-000000000054', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'HG', 'Histoire - Géographie', 2.0),
    ('00000000-0000-0000-0000-000000000055', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'SVT', 'Sciences de la Vie et de la Terre', 3.0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHÉMA TERMINÉ !
-- ============================================================================
