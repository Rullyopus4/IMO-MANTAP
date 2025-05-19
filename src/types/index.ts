export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: 'admin' | 'nurse' | 'patient';
  name: string;
  createdAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  medicationSchedule: MedicationSchedule[];
  nurseId: string;
}

export interface Nurse extends User {
  role: 'nurse';
  patients: string[]; // Array of patient IDs
}

export interface Admin extends User {
  role: 'admin';
}

export interface MedicationSchedule {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdBy: string; // Nurse ID who created this schedule
}

export interface MedicationRecord {
  id: string;
  scheduleId: string;
  patientId: string;
  taken: boolean;
  scheduledTime: Date;
  actualTime?: Date;
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}