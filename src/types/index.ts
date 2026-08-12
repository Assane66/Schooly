export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'DIRECTEUR' 
  | 'ADMIN' 
  | 'SECRETAIRE' 
  | 'COMPTABLE' 
  | 'ENSEIGNANT' 
  | 'SURVEILLANT' 
  | 'PARENT' 
  | 'ELEVE';

export type Permission = 
  | 'students.view' 
  | 'students.create' 
  | 'students.edit' 
  | 'students.delete'
  | 'payments.view' 
  | 'payments.create' 
  | 'payments.edit' 
  | 'payments.delete'
  | 'grades.view' 
  | 'grades.create' 
  | 'grades.edit'
  | 'attendance.view' 
  | 'attendance.create'
  | 'reports.view' 
  | 'reports.generate'
  | 'settings.manage'
  | 'users.manage';

export type SchoolType = 
  | 'Préscolaire' 
  | 'Primaire' 
  | 'Collège' 
  | 'Lycée' 
  | 'Universitaire' 
  | 'Formation professionnelle';

export interface School {
  id: string;
  name: string;
  code: string;
  logo: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  schoolTypes: SchoolType[];
  headmaster: string;
  currentAcademicYearId: string;
  primaryColor: string;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  createdAt: string;
}

export interface User {
  id: string;
  schoolId?: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  permissions: Permission[];
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  label: string; // e.g. "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'ACTIVE' | 'CLOSED';
}

export interface AcademicPeriod {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string; // e.g., "Trimestre 1" or "Semestre 1"
  startDate: string;
  endDate: string;
  weight: number;
}

export interface Level {
  id: string;
  schoolId: string;
  code: string;
  label: string; // e.g., "Primaire", "Collège"
}

export interface Class {
  id: string;
  schoolId: string;
  levelId: string;
  name: string; // e.g. "CM2 A"
  maxCapacity: number;
  mainTeacherId?: string;
  academicYearId: string;
  studentCount: number;
}

export interface Student {
  id: string;
  schoolId: string;
  matricule: string; // ELV-2026-00001
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  photo: string;
  address: string;
  phone?: string;
  email?: string;
  status: 'INSCRIT' | 'PREINSCRIT' | 'PARTI' | 'SUSPENDU';
  parentId?: string;
  currentClassId?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  status: 'ACTIVE' | 'PASSED' | 'FAILED' | 'TRANSFERRED';
  enrollmentDate: string;
}

export interface Parent {
  id: string;
  schoolId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  email: string;
  occupation: string;
  studentIds: string[];
}

export interface Teacher {
  id: string;
  schoolId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  specialty: string;
  photo: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  code: string;
  name: string;
  defaultCoefficient: number;
  levelId: string;
}

export interface TeacherAssignment {
  id: string;
  schoolId: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  academicYearId: string;
}

export type EvaluationType = 'DEVOIR' | 'COMPOSITION' | 'INTERROGATION' | 'EXAMEN';

export interface Evaluation {
  id: string;
  schoolId: string;
  title: string;
  evaluationType: EvaluationType;
  subjectId: string;
  classId: string;
  academicPeriodId: string;
  date: string;
  maxMark: number; // e.g. 20
  coefficient: number; // e.g. 1, 2
}

export interface Grade {
  id: string;
  schoolId: string;
  evaluationId: string;
  studentId: string;
  mark: number;
  comment?: string;
  createdAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'RETARD';

export interface Attendance {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  date: string;
  time: string;
  status: AttendanceStatus;
  durationMinutes?: number;
  reason?: string;
  recordedById: string;
}

export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY' | 'CASH' | 'CHEQUE' | 'BANK_TRANSFER';
export type PaymentStatus = 'REGLE' | 'PARTIEL' | 'EN_ATTENTE' | 'EN_RETARD' | 'EXONERE';

export interface Payment {
  id: string;
  schoolId: string;
  studentId: string;
  academicYearId: string;
  amount: number;
  month: string; // e.g. "Octobre 2025"
  date: string;
  paymentMethod: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  recordedById: string;
}

export interface Registration {
  id: string;
  schoolId: string;
  candidateFirstName: string;
  candidateLastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  parentName: string;
  parentPhone: string;
  requestedClassId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
}

export interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  coefficient: number;
  devoirMark?: number;
  compositionMark?: number;
  subjectAverage: number;
  appreciation: string;
  teacherName: string;
}

export interface ReportCard {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  academicPeriodId: string;
  academicYearId: string;
  gpa: number;
  rank: number;
  classAverage: number;
  highestGpa: number;
  lowestGpa: number;
  subjects: SubjectSummary[];
  absencesCount: number;
  latenessCount: number;
  appreciation: string;
  generatedAt: string;
}

export interface StudentCard {
  id: string;
  schoolId: string;
  studentId: string;
  cardCode: string;
  issuedAt: string;
  expiresAt: string;
}

export interface Event {
  id: string;
  schoolId: string;
  title: string;
  eventType: 'EXAM' | 'HOLIDAY' | 'MEETING' | 'REENTREE' | 'AUTRE';
  startDate: string;
  endDate: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface Plan {
  id: string;
  name: string;
  priceFcfa: number;
  maxStudents: number;
  maxUsers: number;
  maxClasses: number;
  features: string[];
}

export interface Subscription {
  id: string;
  schoolId: string;
  planId: string;
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  startDate: string;
  endDate: string;
  studentLimit: number;
  usedStudents: number;
}
