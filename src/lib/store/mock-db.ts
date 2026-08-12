import { 
  School, User, AcademicYear, AcademicPeriod, Level, Class, 
  Student, Enrollment, Parent, Teacher, Subject, TeacherAssignment, 
  Evaluation, Grade, Attendance, Payment, Registration, ReportCard, 
  StudentCard, Event, ActivityLog, Plan, Subscription, UserRole 
} from '@/types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    priceFcfa: 25000,
    maxStudents: 150,
    maxUsers: 5,
    maxClasses: 6,
    features: [
      'Gestion administrative & élèves',
      'Inscriptions & Matricules automatiques',
      'Bulletins simples PDF',
      'Support par e-mail'
    ]
  },
  {
    id: 'plan-standard',
    name: 'Standard',
    priceFcfa: 55000,
    maxStudents: 500,
    maxUsers: 20,
    maxClasses: 20,
    features: [
      'Toutes les fonctions de Basic',
      'Paiements & Reçus automatisés',
      'Gestion des Impayés & Relances',
      'Module Présence & Retards',
      'Génération de cartes d\'élèves QR',
      'Support prioritaire WhatsApp'
    ]
  },
  {
    id: 'plan-premium',
    name: 'Premium (Tout-en-Un)',
    priceFcfa: 120000,
    maxStudents: 2500,
    maxUsers: 100,
    maxClasses: 80,
    features: [
      'Toutes les fonctions de Standard',
      'Accès Espace Parents & Élèves',
      'Import / Export Excel illimité',
      'Bulletins personnalisés aux couleurs de l\'école',
      'Statistiques avancées & Audit d\'actions',
      'Accompagnement & Onboarding dédié'
    ]
  }
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-dakar-01',
    name: 'Complexe Scolaire Excellence de Dakar',
    code: 'EXCELLENCE-DKR',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
    address: 'Avenue Cheikh Anta Diop, Mermoz',
    city: 'Dakar',
    country: 'Sénégal',
    phone: '+221 33 824 55 00',
    whatsapp: '+221 77 654 32 10',
    email: 'contact@excellence-dakar.edu.sn',
    website: 'https://excellence-dakar.edu.sn',
    schoolTypes: ['Primaire', 'Collège', 'Lycée'],
    headmaster: 'Dr. Ousmane Kane',
    currentAcademicYearId: 'ay-2025-2026',
    primaryColor: '#0284c7',
    currency: 'FCFA',
    status: 'ACTIVE',
    createdAt: '2024-09-01T08:00:00Z'
  },
  {
    id: 'sch-sl-02',
    name: 'Lycée Privé Saint-Louis Horizon',
    code: 'HORIZON-SL',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80',
    address: 'Quartier Sor, Rue 14',
    city: 'Saint-Louis',
    country: 'Sénégal',
    phone: '+221 33 961 12 34',
    whatsapp: '+221 78 111 22 33',
    email: 'admin@saintlouishorizon.sn',
    website: 'https://saintlouishorizon.sn',
    schoolTypes: ['Collège', 'Lycée'],
    headmaster: 'Mme Aïssatou Sy',
    currentAcademicYearId: 'ay-2025-2026',
    primaryColor: '#059669',
    currency: 'FCFA',
    status: 'ACTIVE',
    createdAt: '2024-10-15T10:00:00Z'
  }
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2025-2026',
    schoolId: 'sch-dakar-01',
    label: '2025-2026',
    startDate: '2025-10-01',
    endDate: '2026-07-15',
    isCurrent: true,
    status: 'ACTIVE'
  },
  {
    id: 'ay-2024-2025',
    schoolId: 'sch-dakar-01',
    label: '2024-2025',
    startDate: '2024-10-01',
    endDate: '2025-07-15',
    isCurrent: false,
    status: 'CLOSED'
  }
];

export const INITIAL_PERIODS: AcademicPeriod[] = [
  {
    id: 'per-t1',
    schoolId: 'sch-dakar-01',
    academicYearId: 'ay-2025-2026',
    name: 'Trimestre 1',
    startDate: '2025-10-01',
    endDate: '2025-12-20',
    weight: 1.0
  },
  {
    id: 'per-t2',
    schoolId: 'sch-dakar-01',
    academicYearId: 'ay-2025-2026',
    name: 'Trimestre 2',
    startDate: '2026-01-05',
    endDate: '2026-03-31',
    weight: 1.0
  },
  {
    id: 'per-t3',
    schoolId: 'sch-dakar-01',
    academicYearId: 'ay-2025-2026',
    name: 'Trimestre 3',
    startDate: '2026-04-15',
    endDate: '2026-07-10',
    weight: 1.0
  }
];

export const INITIAL_LEVELS: Level[] = [
  { id: 'lvl-pri', schoolId: 'sch-dakar-01', code: 'PRI', label: 'Primaire' },
  { id: 'lvl-col', schoolId: 'sch-dakar-01', code: 'COL', label: 'Collège' },
  { id: 'lvl-lyc', schoolId: 'sch-dakar-01', code: 'LYC', label: 'Lycée' }
];

export const INITIAL_CLASSES: Class[] = [
  {
    id: 'cls-cm2a',
    schoolId: 'sch-dakar-01',
    levelId: 'lvl-pri',
    name: 'CM2 A',
    maxCapacity: 40,
    mainTeacherId: 'user-teach-1',
    academicYearId: 'ay-2025-2026',
    studentCount: 32
  },
  {
    id: 'cls-6b',
    schoolId: 'sch-dakar-01',
    levelId: 'lvl-col',
    name: '6ème B',
    maxCapacity: 45,
    mainTeacherId: 'user-teach-2',
    academicYearId: 'ay-2025-2026',
    studentCount: 38
  },
  {
    id: 'cls-3a',
    schoolId: 'sch-dakar-01',
    levelId: 'lvl-col',
    name: '3ème A (Troisième)',
    maxCapacity: 40,
    mainTeacherId: 'user-teach-1',
    academicYearId: 'ay-2025-2026',
    studentCount: 35
  },
  {
    id: 'cls-ts2',
    schoolId: 'sch-dakar-01',
    levelId: 'lvl-lyc',
    name: 'Terminale S2',
    maxCapacity: 35,
    mainTeacherId: 'user-teach-3',
    academicYearId: 'ay-2025-2026',
    studentCount: 29
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sbj-fr', schoolId: 'sch-dakar-01', levelId: 'lvl-col', code: 'FRA', name: 'Français & Littérature', defaultCoefficient: 4 },
  { id: 'sbj-math', schoolId: 'sch-dakar-01', levelId: 'lvl-col', code: 'MATH', name: 'Mathématiques', defaultCoefficient: 5 },
  { id: 'sbj-pc', schoolId: 'sch-dakar-01', levelId: 'lvl-col', code: 'PC', name: 'Physique - Chimie', defaultCoefficient: 3 },
  { id: 'sbj-ang', schoolId: 'sch-dakar-01', levelId: 'lvl-col', code: 'ANG', name: 'Anglais', defaultCoefficient: 3 },
  { id: 'sbj-hg', schoolId: 'sch-dakar-01', levelId: 'lvl-col', code: 'HG', name: 'Histoire - Géographie', defaultCoefficient: 2 },
  { id: 'sbj-svt', schoolId: 'sch-dakar-01', levelId: 'lvl-col', code: 'SVT', name: 'Sciences de la Vie et de la Terre', defaultCoefficient: 3 }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    schoolId: 'sch-dakar-01',
    matricule: 'ELV-2026-00001',
    firstName: 'Alpha',
    lastName: 'Ba',
    dateOfBirth: '2013-05-14',
    placeOfBirth: 'Dakar',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    address: 'Sacré-Cœur 3, Villa 45',
    phone: '+221 77 123 45 67',
    email: 'alpha.ba@eleve.sn',
    status: 'INSCRIT',
    parentId: 'parent-001',
    currentClassId: 'cls-cm2a',
    createdAt: '2025-09-02'
  },
  {
    id: 'std-002',
    schoolId: 'sch-dakar-01',
    matricule: 'ELV-2026-00002',
    firstName: 'Fatou',
    lastName: 'Fall',
    dateOfBirth: '2013-08-22',
    placeOfBirth: 'Thiès',
    gender: 'F',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    address: 'Point E, Rue de Diourbel',
    phone: '+221 78 444 55 66',
    email: 'fatou.fall@eleve.sn',
    status: 'INSCRIT',
    parentId: 'parent-002',
    currentClassId: 'cls-cm2a',
    createdAt: '2025-09-05'
  },
  {
    id: 'std-003',
    schoolId: 'sch-dakar-01',
    matricule: 'ELV-2026-00003',
    firstName: 'Moussa',
    lastName: 'Diop',
    dateOfBirth: '2011-02-10',
    placeOfBirth: 'Saint-Louis',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    address: 'Fann Résidence, Rue 6',
    phone: '+221 70 888 99 00',
    status: 'INSCRIT',
    parentId: 'parent-001',
    currentClassId: 'cls-6b',
    createdAt: '2025-09-10'
  },
  {
    id: 'std-004',
    schoolId: 'sch-dakar-01',
    matricule: 'ELV-2026-00004',
    firstName: 'Aïcha',
    lastName: 'Sow',
    dateOfBirth: '2008-11-04',
    placeOfBirth: 'Dakar',
    gender: 'F',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: 'Maristes, Immeuble B',
    phone: '+221 77 999 11 22',
    status: 'INSCRIT',
    parentId: 'parent-003',
    currentClassId: 'cls-ts2',
    createdAt: '2025-09-12'
  },
  {
    id: 'std-005',
    schoolId: 'sch-dakar-01',
    matricule: 'ELV-2026-00005',
    firstName: 'Ibrahima',
    lastName: 'Ndiaye',
    dateOfBirth: '2010-09-19',
    placeOfBirth: 'Kaolack',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: 'Ouakam, Cité Avion',
    status: 'INSCRIT',
    currentClassId: 'cls-3a',
    createdAt: '2025-09-15'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-superadmin',
    email: 'superadmin@saas-ecole.sn',
    name: 'Modou Khouma (Super Admin SaaS)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    role: 'SUPER_ADMIN',
    active: true,
    permissions: ['students.view', 'students.create', 'students.edit', 'students.delete', 'payments.view', 'payments.create', 'payments.edit', 'payments.delete', 'grades.view', 'grades.create', 'grades.edit', 'attendance.view', 'attendance.create', 'reports.view', 'reports.generate', 'settings.manage', 'users.manage'],
    createdAt: '2024-01-01'
  },
  {
    id: 'usr-director',
    schoolId: 'sch-dakar-01',
    email: 'directeur@excellence-dakar.edu.sn',
    name: 'Dr. Ousmane Kane (Directeur)',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
    role: 'DIRECTEUR',
    phone: '+221 77 654 32 10',
    active: true,
    permissions: ['students.view', 'students.create', 'students.edit', 'students.delete', 'payments.view', 'payments.create', 'payments.edit', 'payments.delete', 'grades.view', 'grades.create', 'grades.edit', 'attendance.view', 'attendance.create', 'reports.view', 'reports.generate', 'settings.manage', 'users.manage'],
    createdAt: '2024-09-01'
  },
  {
    id: 'user-teach-1',
    schoolId: 'sch-dakar-01',
    email: 'mamadou.diop@excellence-dakar.edu.sn',
    name: 'Mamadou Diop (Prof. Mathématiques)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    role: 'ENSEIGNANT',
    phone: '+221 77 333 44 55',
    active: true,
    permissions: ['students.view', 'grades.view', 'grades.create', 'grades.edit', 'attendance.view', 'attendance.create'],
    createdAt: '2024-09-10'
  },
  {
    id: 'user-teach-2',
    schoolId: 'sch-dakar-01',
    email: 'aminata.sow@excellence-dakar.edu.sn',
    name: 'Mme Aminata Sow (Prof. Français)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    role: 'ENSEIGNANT',
    phone: '+221 78 222 33 44',
    active: true,
    permissions: ['students.view', 'grades.view', 'grades.create', 'grades.edit', 'attendance.view', 'attendance.create'],
    createdAt: '2024-09-12'
  },
  {
    id: 'usr-comptable',
    schoolId: 'sch-dakar-01',
    email: 'comptable@excellence-dakar.edu.sn',
    name: 'Cheikh Tidiane Wade (Comptable)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    role: 'COMPTABLE',
    phone: '+221 76 555 66 77',
    active: true,
    permissions: ['payments.view', 'payments.create', 'payments.edit', 'reports.view'],
    createdAt: '2024-09-15'
  },
  {
    id: 'usr-surveillant',
    schoolId: 'sch-dakar-01',
    email: 'surveillant@excellence-dakar.edu.sn',
    name: 'Oumar Diallo (Surveillant Général)',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    role: 'SURVEILLANT',
    phone: '+221 77 111 22 33',
    active: true,
    permissions: ['students.view', 'attendance.view', 'attendance.create'],
    createdAt: '2024-09-20'
  },
  {
    id: 'usr-parent',
    schoolId: 'sch-dakar-01',
    email: 'abdoulaye.ba@gmail.com',
    name: 'Abdoulaye Ba (Parent d\'élève)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    role: 'PARENT',
    phone: '+221 77 654 99 88',
    active: true,
    permissions: ['students.view', 'grades.view', 'attendance.view', 'payments.view', 'reports.view'],
    createdAt: '2025-09-02'
  },
  {
    id: 'usr-student',
    schoolId: 'sch-dakar-01',
    email: 'alpha.ba@eleve.sn',
    name: 'Alpha Ba (Élève CM2 A)',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
    role: 'ELEVE',
    active: true,
    permissions: ['students.view', 'grades.view', 'attendance.view', 'reports.view'],
    createdAt: '2025-09-02'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    schoolId: 'sch-dakar-01',
    studentId: 'std-001',
    academicYearId: 'ay-2025-2026',
    amount: 35000,
    month: 'Octobre 2025',
    date: '2025-10-05',
    paymentMethod: 'WAVE',
    reference: 'WAV-883920192',
    status: 'REGLE',
    recordedById: 'usr-comptable'
  },
  {
    id: 'pay-002',
    schoolId: 'sch-dakar-01',
    studentId: 'std-001',
    academicYearId: 'ay-2025-2026',
    amount: 35000,
    month: 'Novembre 2025',
    date: '2025-11-04',
    paymentMethod: 'ORANGE_MONEY',
    reference: 'OM-33291044',
    status: 'REGLE',
    recordedById: 'usr-comptable'
  },
  {
    id: 'pay-003',
    schoolId: 'sch-dakar-01',
    studentId: 'std-002',
    academicYearId: 'ay-2025-2026',
    amount: 35000,
    month: 'Octobre 2025',
    date: '2025-10-08',
    paymentMethod: 'CASH',
    reference: 'REC-00192',
    status: 'REGLE',
    recordedById: 'usr-comptable'
  },
  {
    id: 'pay-004',
    schoolId: 'sch-dakar-01',
    studentId: 'std-003',
    academicYearId: 'ay-2025-2026',
    amount: 40000,
    month: 'Novembre 2025',
    date: '2025-11-10',
    paymentMethod: 'WAVE',
    reference: 'WAV-99102931',
    status: 'PARTIEL',
    recordedById: 'usr-comptable'
  },
  {
    id: 'pay-005',
    schoolId: 'sch-dakar-01',
    studentId: 'std-005',
    academicYearId: 'ay-2025-2026',
    amount: 45000,
    month: 'Novembre 2025',
    date: '2025-11-01',
    paymentMethod: 'CASH',
    reference: 'EN-RETARD',
    status: 'EN_RETARD',
    recordedById: 'usr-comptable'
  }
];

export const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-math-1',
    schoolId: 'sch-dakar-01',
    title: 'Devoir N°1 de Mathématiques',
    evaluationType: 'DEVOIR',
    subjectId: 'sbj-math',
    classId: 'cls-cm2a',
    academicPeriodId: 'per-t1',
    date: '2025-10-20',
    maxMark: 20,
    coefficient: 1
  },
  {
    id: 'eval-math-2',
    schoolId: 'sch-dakar-01',
    title: 'Composition du Trimestre 1',
    evaluationType: 'COMPOSITION',
    subjectId: 'sbj-math',
    classId: 'cls-cm2a',
    academicPeriodId: 'per-t1',
    date: '2025-12-10',
    maxMark: 20,
    coefficient: 2
  },
  {
    id: 'eval-fr-1',
    schoolId: 'sch-dakar-01',
    title: 'Devoir de Grammaire & Orthographe',
    evaluationType: 'DEVOIR',
    subjectId: 'sbj-fr',
    classId: 'cls-cm2a',
    academicPeriodId: 'per-t1',
    date: '2025-10-25',
    maxMark: 20,
    coefficient: 1
  }
];

export const INITIAL_GRADES: Grade[] = [
  { id: 'grd-01', schoolId: 'sch-dakar-01', evaluationId: 'eval-math-1', studentId: 'std-001', mark: 16.5, comment: 'Très bon raisonnement', createdAt: '2025-10-21' },
  { id: 'grd-02', schoolId: 'sch-dakar-01', evaluationId: 'eval-math-2', studentId: 'std-001', mark: 17.0, comment: 'Excellent travail en géométrie', createdAt: '2025-12-11' },
  { id: 'grd-03', schoolId: 'sch-dakar-01', evaluationId: 'eval-fr-1', studentId: 'std-001', mark: 15.0, comment: 'Bonne maîtrise de la dictée', createdAt: '2025-10-26' },
  
  { id: 'grd-04', schoolId: 'sch-dakar-01', evaluationId: 'eval-math-1', studentId: 'std-002', mark: 14.0, comment: 'Bien', createdAt: '2025-10-21' },
  { id: 'grd-05', schoolId: 'sch-dakar-01', evaluationId: 'eval-math-2', studentId: 'std-002', mark: 15.5, comment: 'En progrès', createdAt: '2025-12-11' },
  { id: 'grd-06', schoolId: 'sch-dakar-01', evaluationId: 'eval-fr-1', studentId: 'std-002', mark: 16.0, comment: 'Très bonne rédaction', createdAt: '2025-10-26' }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  { id: 'att-01', schoolId: 'sch-dakar-01', studentId: 'std-001', classId: 'cls-cm2a', date: '2025-11-12', time: '08:15', status: 'RETARD', durationMinutes: 15, reason: 'Embouteillages', recordedById: 'usr-surveillant' },
  { id: 'att-02', schoolId: 'sch-dakar-01', studentId: 'std-002', classId: 'cls-cm2a', date: '2025-11-15', time: '08:00', status: 'ABSENT', durationMinutes: 240, reason: 'Rendez-vous médical', recordedById: 'usr-surveillant' },
  { id: 'att-03', schoolId: 'sch-dakar-01', studentId: 'std-005', classId: 'cls-3a', date: '2025-11-20', time: '08:00', status: 'ABSENT', durationMinutes: 480, reason: 'Non justifié', recordedById: 'usr-surveillant' }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    schoolId: 'sch-dakar-01',
    candidateFirstName: 'Samba',
    candidateLastName: 'Diallo',
    dateOfBirth: '2014-04-12',
    placeOfBirth: 'Dakar',
    gender: 'M',
    parentName: 'Mamadou Diallo',
    parentPhone: '+221 77 555 12 34',
    requestedClassId: 'cls-cm2a',
    status: 'PENDING',
    submittedAt: '2026-08-10T11:20:00Z'
  },
  {
    id: 'reg-002',
    schoolId: 'sch-dakar-01',
    candidateFirstName: 'Khadija',
    candidateLastName: 'Ndiaye',
    dateOfBirth: '2012-09-30',
    placeOfBirth: 'Rufisque',
    gender: 'F',
    parentName: 'Astou Seck',
    parentPhone: '+221 78 999 88 77',
    requestedClassId: 'cls-6b',
    status: 'PENDING',
    submittedAt: '2026-08-11T14:45:00Z'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-001',
    schoolId: 'sch-dakar-01',
    userId: 'usr-director',
    userName: 'Dr. Ousmane Kane',
    userRole: 'DIRECTEUR',
    action: 'student_created',
    details: 'Création de la fiche élève Alpha Ba (ELV-2026-00001)',
    timestamp: '2025-09-02T09:30:00Z'
  },
  {
    id: 'log-002',
    schoolId: 'sch-dakar-01',
    userId: 'usr-comptable',
    userName: 'Cheikh Tidiane Wade',
    userRole: 'COMPTABLE',
    action: 'payment_created',
    details: 'Paiement mensualité Octobre réglé (35 000 FCFA) par Wave',
    timestamp: '2025-10-05T14:15:00Z'
  },
  {
    id: 'log-003',
    schoolId: 'sch-dakar-01',
    userId: 'user-teach-1',
    userName: 'Mamadou Diop',
    userRole: 'ENSEIGNANT',
    action: 'grade_created',
    details: 'Saisie des notes Devoir N°1 Mathématiques pour la classe CM2 A',
    timestamp: '2025-10-21T16:00:00Z'
  }
];
