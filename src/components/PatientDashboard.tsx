import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getPatientMedicationSchedules, 
  getPatientMedicationRecords,
  createMedicationRecord
} from '../data/mockData';
import { MedicationSchedule, MedicationRecord } from '../types';

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [records, setRecords] = useState<MedicationRecord[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<{
    schedule: MedicationSchedule;
    time: string;
    taken: boolean;
    record?: MedicationRecord;
  }[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser?.id) {
      const patientSchedules = getPatientMedicationSchedules(currentUser.id);
      setSchedules(patientSchedules);
      
      const patientRecords = getPatientMedicationRecords(currentUser.id);
      setRecords(patientRecords);
    }
  }, [currentUser]);

  useEffect(() => {
    // Generate today's schedule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayItems: {
      schedule: MedicationSchedule;
      time: string;
      taken: boolean;
      record?: MedicationRecord;
    }[] = [];
    
    schedules.forEach(schedule => {
      const startDate = new Date(schedule.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      // Check if today is after or equal to the start date
      if (today >= startDate) {
        // If there's an end date, check if today is before or equal to it
        if (!schedule.endDate || (schedule.endDate && today <= new Date(schedule.endDate))) {
          // Create an entry for each time of day
          schedule.timeOfDay.forEach(time => {
            const scheduledDateTime = new Date(today);
            const [hours, minutes] = time.split(':').map(Number);
            scheduledDateTime.setHours(hours, minutes, 0, 0);
            
            // Find if there's a record for this schedule and time
            const record = records.find(r => {
              const recordDate = new Date(r.scheduledTime);
              return (
                r.scheduleId === schedule.id &&
                recordDate.getDate() === today.getDate() &&
                recordDate.getMonth() === today.getMonth() &&
                recordDate.getFullYear() === today.getFullYear() &&
                recordDate.getHours() === hours &&
                recordDate.getMinutes() === minutes
              );
            });
            
            todayItems.push({
              schedule,
              time,
              taken: record ? record.taken : false,
              record,
            });
          });
        }
      }
    });
    
    // Sort by time
    todayItems.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    setTodaySchedules(todayItems);
  }, [schedules, records]);

  const handleMedicationTaken = (item: typeof todaySchedules[0], taken: boolean, notes: string = '') => {
    if (!currentUser) return;
    
    const today = new Date();
    const [hours, minutes] = item.time.split(':').map(Number);
    const scheduledTime = new Date(today);
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    let record: MedicationRecord;
    
    if (item.record) {
      // Update existing record
      record = {
        ...item.record,
        taken,
        actualTime: taken ? new Date() : undefined,
        notes: notes || item.record.notes,
      };
    } else {
      // Create new record
      record = {
        id: `record${Date.now()}`,
        scheduleId: item.schedule.id,
        patientId: currentUser.id,
        taken,
        scheduledTime,
        actualTime: taken ? new Date() : undefined,
        notes,
      };
    }
    
    createMedicationRecord(record);
    
    // Refresh data
    const patientRecords = getPatientMedicationRecords(currentUser.id);
    setRecords(patientRecords);
    
    setSuccessMessage(taken ? 'Berhasil mencatat obat telah diminum' : 'Berhasil mencatat obat tidak diminum');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const calculateAdherenceRate = (): number => {
    if (records.length === 0) return 0;
    
    const takenCount = records.filter(record => record.taken).length;
    return Math.round((takenCount / records.length) * 100);
  };

  const getProgressColor = (rate: number): string => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getNow = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Pasien</h1>
      
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Medication */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 bg-blue-900 text-white rounded-t-lg">
              <h3 className="text-lg font-medium">Jadwal Obat Hari Ini</h3>
              <p className="mt-1 max-w-2xl text-sm">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {todaySchedules.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada jadwal obat</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Anda tidak memiliki jadwal minum obat untuk hari ini.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {todaySchedules.map((item, index) => {
                    const now = getNow();
                    const isPast = now > item.time;
                    const isCurrent = !item.taken && now.substring(0, 2) === item.time.substring(0, 2);
                    
                    return (
                      <div 
                        key={`${item.schedule.id}-${item.time}`}
                        className={`border rounded-lg p-4 ${
                          item.taken 
                            ? 'border-green-200 bg-green-50' 
                            : isPast 
                            ? 'border-red-200 bg-red-50'
                            : isCurrent
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {item.schedule.medicineName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Dosis: {item.schedule.dosage}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-500 mr-1" />
                            <span className={`text-lg font-semibold ${
                              isCurrent ? 'text-yellow-700' : ''
                            }`}>
                              {item.time}
                            </span>
                          </div>
                        </div>
                        
                        {item.schedule.notes && (
                          <div className="mt-2 text-sm text-gray-700">
                            <p className="font-medium">Catatan:</p>
                            <p>{item.schedule.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            {item.taken ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-4 w-4 mr-1" />
                                Sudah diminum
                              </span>
                            ) : isPast ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Terlewatkan
                              </span>
                            ) : isCurrent ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="h-4 w-4 mr-1" />
                                Waktunya minum obat
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Clock className="h-4 w-4 mr-1" />
                                Jadwal berikutnya
                              </span>
                            )}
                          </div>
                          
                          {!item.taken && (
                            <button
                              type="button"
                              onClick={() => handleMedicationTaken(item, true)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Tandai Sudah Diminum
                            </button>
                          )}
                          
                          {!item.taken && isPast && (
                            <button
                              type="button"
                              onClick={() => handleMedicationTaken(item, false, "Terlewatkan")}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Tandai Tidak Diminum
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats and Upcoming */}
        <div className="lg:col-span-1 space-y-6">
          {/* Adherence Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Statistik Kepatuhan
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="relative h-36 w-36 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={getProgressColor(calculateAdherenceRate())}
                      strokeWidth="3"
                      strokeDasharray={`${calculateAdherenceRate()}, 100`}
                    />
                  </svg>
                  <div className="absolute text-2xl font-bold text-gray-900">
                    {calculateAdherenceRate()}%
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-sm font-medium text-gray-900">Total Catatan</h4>
                  <p className="text-3xl font-semibold text-gray-900">{records.length}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold text-green-700">
                      {records.filter(r => r.taken).length}
                    </div>
                    <div className="text-sm text-green-700">Diminum</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold text-red-700">
                      {records.filter(r => !r.taken).length}
                    </div>
                    <div className="text-sm text-red-700">Terlewat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* All Medications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Daftar Obat
              </h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">
                        {schedule.medicineName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Dosis: {schedule.dosage}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {schedule.frequency === 'daily' ? 'Harian' : schedule.frequency}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    {schedule.timeOfDay.map((time, index) => (
                      <div key={index} className="text-sm text-gray-700 flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {schedules.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada jadwal obat untuk Anda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;