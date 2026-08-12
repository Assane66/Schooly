'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  School, User, UserRole, AcademicYear, AcademicPeriod, Level, Class, 
  Student, Parent, Teacher, Subject, Evaluation, Grade, Attendance, 
  Payment, Registration, ActivityLog, Plan, Subscription 
} from '@/types';
import { 
  INITIAL_SCHOOLS, INITIAL_ACADEMIC_YEARS, INITIAL_PERIODS, INITIAL_LEVELS, 
  INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_STUDENTS, INITIAL_USERS, 
  INITIAL_PAYMENTS, INITIAL_EVALUATIONS, INITIAL_GRADES, INITIAL_ATTENDANCE, 
  INITIAL_REGISTRATIONS, INITIAL_LOGS, INITIAL_PLANS 
} from './mock-db';

interface AppContextType {
  // Current active tenant & role
  currentSchool: School;
  currentRole: UserRole;
  currentUser: User;
  setCurrentSchool: (school: School) => void;
  setCurrentRole: (role: UserRole) => void;
  
  // Data collections
  schools: School[];
  users: User[];
  academicYears: AcademicYear[];
  periods: AcademicPeriod[];
  levels: Level[];
  classes: Class[];
  students: Student[];
  subjects: Subject[];
  evaluations: Evaluation[];
  grades: Grade[];
  payments: Payment[];
  attendance: Attendance[];
  registrations: Registration[];
  logs: ActivityLog[];
  plans: Plan[];

  // Mutators & Operations
  addStudent: (studentData: Partial<Student>) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  importStudents: (newStudents: Partial<Student>[]) => number;
  
  addPayment: (paymentData: Partial<Payment>) => Payment;
  addGrade: (gradeData: Partial<Grade>) => Grade;
  addEvaluation: (evalData: Partial<Evaluation>) => Evaluation;
  addAttendance: (attendanceData: Partial<Attendance>) => Attendance;
  processRegistration: (id: string, action: 'ACCEPT' | 'REJECT') => void;
  
  addSchool: (schoolData: Partial<School>) => School;
  addActivityLog: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [currentSchool, setCurrentSchool] = useState<School>(INITIAL_SCHOOLS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('DIRECTEUR');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [academicYears] = useState<AcademicYear[]>(INITIAL_ACADEMIC_YEARS);
  const [periods] = useState<AcademicPeriod[]>(INITIAL_PERIODS);
  const [levels] = useState<Level[]>(INITIAL_LEVELS);
  const [classes, setClasses] = useState<Class[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(INITIAL_EVALUATIONS);
  const [grades, setGrades] = useState<Grade[]>(INITIAL_GRADES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [attendance, setAttendance] = useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [plans] = useState<Plan[]>(INITIAL_PLANS);

  // Derived current user based on active role
  const currentUser = users.find(u => u.role === currentRole && (u.schoolId === currentSchool.id || u.role === 'SUPER_ADMIN')) || users[1];

  const addActivityLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      schoolId: currentSchool.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentRole,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addStudent = (data: Partial<Student>): Student => {
    const nextMatriculeNumber = students.length + 1;
    const matricule = `ELV-${new Date().getFullYear()}-${String(nextMatriculeNumber).padStart(5, '0')}`;
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      schoolId: currentSchool.id,
      matricule,
      firstName: data.firstName || 'Prénom',
      lastName: data.lastName || 'Nom',
      dateOfBirth: data.dateOfBirth || '2014-01-01',
      placeOfBirth: data.placeOfBirth || 'Dakar',
      gender: data.gender || 'M',
      photo: data.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
      address: data.address || 'Adresse',
      phone: data.phone || '',
      email: data.email || '',
      status: 'INSCRIT',
      currentClassId: data.currentClassId || classes[0]?.id,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => [newStudent, ...prev]);
    addActivityLog('student_created', `Création de l'élève ${newStudent.firstName} ${newStudent.lastName} (${matricule})`);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addActivityLog('student_updated', `Mise à jour des informations de l'élève ID ${id}`);
  };

  const deleteStudent = (id: string) => {
    const std = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (std) {
      addActivityLog('student_deleted', `Suppression de l'élève ${std.firstName} ${std.lastName} (${std.matricule})`);
    }
  };

  const importStudents = (newStudentsData: Partial<Student>[]): number => {
    let count = 0;
    const addedStudents: Student[] = [];
    newStudentsData.forEach((data, index) => {
      const matricule = `ELV-${new Date().getFullYear()}-${String(students.length + count + 1).padStart(5, '0')}`;
      const std: Student = {
        id: `std-imp-${Date.now()}-${index}`,
        schoolId: currentSchool.id,
        matricule,
        firstName: data.firstName || 'Élève',
        lastName: data.lastName || `Import ${index + 1}`,
        dateOfBirth: data.dateOfBirth || '2014-05-10',
        placeOfBirth: data.placeOfBirth || 'Dakar',
        gender: data.gender || 'M',
        photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
        address: data.address || 'Dakar',
        status: 'INSCRIT',
        currentClassId: data.currentClassId || classes[0]?.id,
        createdAt: new Date().toISOString().split('T')[0]
      };
      addedStudents.push(std);
      count++;
    });

    setStudents(prev => [...addedStudents, ...prev]);
    addActivityLog('students_imported', `Importation massive de ${count} élèves via fichier Excel`);
    return count;
  };

  const addPayment = (data: Partial<Payment>): Payment => {
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      schoolId: currentSchool.id,
      studentId: data.studentId || students[0]?.id,
      academicYearId: currentSchool.currentAcademicYearId,
      amount: data.amount || 35000,
      month: data.month || 'Mois en cours',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: data.paymentMethod || 'WAVE',
      reference: data.reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: data.status || 'REGLE',
      recordedById: currentUser.id
    };

    setPayments(prev => [newPayment, ...prev]);
    addActivityLog('payment_created', `Enregistrement paiement de ${newPayment.amount.toLocaleString()} FCFA pour ${newPayment.month}`);
    return newPayment;
  };

  const addGrade = (data: Partial<Grade>): Grade => {
    const newGrade: Grade = {
      id: `grd-${Date.now()}`,
      schoolId: currentSchool.id,
      evaluationId: data.evaluationId || evaluations[0]?.id,
      studentId: data.studentId || students[0]?.id,
      mark: data.mark || 10,
      comment: data.comment || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGrades(prev => [newGrade, ...prev]);
    addActivityLog('grade_created', `Note de ${newGrade.mark}/20 attribuée`);
    return newGrade;
  };

  const addEvaluation = (data: Partial<Evaluation>): Evaluation => {
    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      schoolId: currentSchool.id,
      title: data.title || 'Nouvelle Évaluation',
      evaluationType: data.evaluationType || 'DEVOIR',
      subjectId: data.subjectId || subjects[0]?.id,
      classId: data.classId || classes[0]?.id,
      academicPeriodId: periods[0]?.id,
      date: data.date || new Date().toISOString().split('T')[0],
      maxMark: 20,
      coefficient: data.coefficient || 1
    };

    setEvaluations(prev => [newEval, ...prev]);
    addActivityLog('evaluation_created', `Création de l'évaluation "${newEval.title}"`);
    return newEval;
  };

  const addAttendance = (data: Partial<Attendance>): Attendance => {
    const newAtt: Attendance = {
      id: `att-${Date.now()}`,
      schoolId: currentSchool.id,
      studentId: data.studentId || students[0]?.id,
      classId: data.classId || classes[0]?.id,
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '08:00',
      status: data.status || 'ABSENT',
      durationMinutes: data.durationMinutes || 0,
      reason: data.reason || '',
      recordedById: currentUser.id
    };

    setAttendance(prev => [newAtt, ...prev]);
    addActivityLog('attendance_recorded', `Saisie de présence (${newAtt.status})`);
    return newAtt;
  };

  const processRegistration = (id: string, action: 'ACCEPT' | 'REJECT') => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    if (action === 'ACCEPT') {
      addStudent({
        firstName: reg.candidateFirstName,
        lastName: reg.candidateLastName,
        dateOfBirth: reg.dateOfBirth,
        placeOfBirth: reg.placeOfBirth,
        gender: reg.gender,
        currentClassId: reg.requestedClassId
      });
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
      addActivityLog('registration_accepted', `Candidature de ${reg.candidateFirstName} ${reg.candidateLastName} acceptée`);
    } else {
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
      addActivityLog('registration_rejected', `Candidature de ${reg.candidateFirstName} ${reg.candidateLastName} refusée`);
    }
  };

  const addSchool = (schoolData: Partial<School>): School => {
    const newSchool: School = {
      id: `sch-${Date.now()}`,
      name: schoolData.name || 'Nouvel Établissement',
      code: schoolData.code || `ECOLE-${Math.floor(1000 + Math.random() * 9000)}`,
      logo: schoolData.logo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
      address: schoolData.address || 'Adresse',
      city: schoolData.city || 'Dakar',
      country: schoolData.country || 'Sénégal',
      phone: schoolData.phone || '+221 33 000 00 00',
      whatsapp: schoolData.whatsapp || '+221 77 000 00 00',
      email: schoolData.email || 'ecole@saas.sn',
      schoolTypes: schoolData.schoolTypes || ['Primaire', 'Collège'],
      headmaster: schoolData.headmaster || 'Directeur',
      currentAcademicYearId: 'ay-2025-2026',
      primaryColor: schoolData.primaryColor || '#0284c7',
      currency: 'FCFA',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    setSchools(prev => [newSchool, ...prev]);
    setCurrentSchool(newSchool);
    addActivityLog('school_created', `Création du nouvel établissement SaaS ${newSchool.name}`);
    return newSchool;
  };

  return (
    <AppContext.Provider value={{
      currentSchool,
      currentRole,
      currentUser,
      setCurrentSchool,
      setCurrentRole,
      schools,
      users,
      academicYears,
      periods,
      levels,
      classes,
      students,
      subjects,
      evaluations,
      grades,
      payments,
      attendance,
      registrations,
      logs,
      plans,
      addStudent,
      updateStudent,
      deleteStudent,
      importStudents,
      addPayment,
      addGrade,
      addEvaluation,
      addAttendance,
      processRegistration,
      addSchool,
      addActivityLog
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
