import { Admin, Nurse, Patient, MedicationSchedule, MedicationRecord, Message } from '../types';

// Admin users
export const admins: Admin[] = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator Utama',
    createdAt: new Date('2023-01-01'),
  },
];

// Nurse users
export const nurses: Nurse[] = [
  {
    id: 'nurse1',
    username: 'perawat1',
    password: 'perawat123',
    role: 'nurse',
    name: 'Ani Perawat',
    createdAt: new Date('2023-01-15'),
    patients: ['patient1', 'patient2'],
  },
];

// Patient users
export const patients: Patient[] = [
  {
    id: 'patient1',
    username: 'pasien1',
    password: 'pasien123',
    role: 'patient',
    name: 'Budi Santoso',
    createdAt: new Date('2023-02-01'),
    nurseId: 'nurse1',
    medicationSchedule: [],
  },
  {
    id: 'patient2',
    username: 'pasien2',
    password: 'pasien123',
    role: 'patient',
    name: 'Siti Rahayu',
    createdAt: new Date('2023-02-15'),
    nurseId: 'nurse1',
    medicationSchedule: [],
  },
];

// Medication schedules
export const medicationSchedules: MedicationSchedule[] = [
  {
    id: 'sched1',
    patientId: 'patient1',
    medicineName: 'Amlodipin',
    dosage: '10mg',
    frequency: 'daily',
    timeOfDay: ['08:00', '20:00'],
    startDate: new Date('2023-03-01'),
    notes: 'Minum setelah makan',
    createdBy: 'nurse1',
  },
  {
    id: 'sched2',
    patientId: 'patient2',
    medicineName: 'Captopril',
    dosage: '25mg',
    frequency: 'daily',
    timeOfDay: ['07:00', '19:00'],
    startDate: new Date('2023-03-15'),
    notes: 'Minum 1 jam sebelum makan',
    createdBy: 'nurse1',
  },
];

// Medication records
export const medicationRecords: MedicationRecord[] = [
  {
    id: 'record1',
    scheduleId: 'sched1',
    patientId: 'patient1',
    taken: true,
    scheduledTime: new Date('2023-04-01T08:00:00'),
    actualTime: new Date('2023-04-01T08:15:00'),
    notes: 'Terasa sedikit mual',
  },
  {
    id: 'record2',
    scheduleId: 'sched1',
    patientId: 'patient1',
    taken: false,
    scheduledTime: new Date('2023-04-01T20:00:00'),
  },
];

// Messages
export const messages: Message[] = [
  {
    id: 'msg1',
    senderId: 'nurse1',
    receiverId: 'patient1',
    content: 'Bagaimana perasaan Anda setelah minum obat pagi ini?',
    read: true,
    createdAt: new Date('2023-04-01T10:00:00'),
  },
  {
    id: 'msg2',
    senderId: 'patient1',
    receiverId: 'nurse1',
    content: 'Saya merasa sedikit mual, tapi sudah membaik sekarang.',
    read: false,
    createdAt: new Date('2023-04-01T10:30:00'),
  },
];

// Initialize patient medication schedules
patients[0].medicationSchedule = [medicationSchedules[0]];
patients[1].medicationSchedule = [medicationSchedules[1]];

// Data CRUD functions
let allAdmins = [...admins];
let allNurses = [...nurses];
let allPatients = [...patients];
let allMedicationSchedules = [...medicationSchedules];
let allMedicationRecords = [...medicationRecords];
let allMessages = [...messages];

// Admin functions
export const getAllUsers = () => {
  return [...allAdmins, ...allNurses, ...allPatients];
};

export const createUser = (user: Admin | Nurse | Patient) => {
  if (user.role === 'admin') {
    allAdmins = [...allAdmins, user as Admin];
  } else if (user.role === 'nurse') {
    allNurses = [...allNurses, user as Nurse];
  } else {
    allPatients = [...allPatients, user as Patient];
  }
  return user;
};

// Nurse functions
export const getNursePatients = (nurseId: string) => {
  return allPatients.filter(patient => patient.nurseId === nurseId);
};

export const createMedicationSchedule = (schedule: MedicationSchedule) => {
  allMedicationSchedules = [...allMedicationSchedules, schedule];
  // Update patient's medication schedule
  const patientIndex = allPatients.findIndex(p => p.id === schedule.patientId);
  if (patientIndex !== -1) {
    allPatients[patientIndex].medicationSchedule.push(schedule);
  }
  return schedule;
};

// Patient functions
export const getPatientMedicationSchedules = (patientId: string) => {
  return allMedicationSchedules.filter(schedule => schedule.patientId === patientId);
};

export const getPatientMedicationRecords = (patientId: string) => {
  return allMedicationRecords.filter(record => record.patientId === patientId);
};

export const createMedicationRecord = (record: MedicationRecord) => {
  allMedicationRecords = [...allMedicationRecords, record];
  return record;
};

// Message functions
export const getUserMessages = (userId: string) => {
  return allMessages.filter(
    message => message.receiverId === userId || message.senderId === userId
  );
};

export const sendMessage = (message: Message) => {
  allMessages = [...allMessages, message];
  return message;
};