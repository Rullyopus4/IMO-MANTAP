import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Activity, 
  PlusCircle, 
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getNursePatients, 
  createMedicationSchedule, 
  getPatientMedicationRecords 
} from '../data/mockData';
import { Patient, MedicationSchedule, MedicationRecord } from '../types';

const NurseDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicationRecord[]>([]);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<MedicationSchedule>>({
    medicineName: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    startDate: new Date(),
    notes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser?.id) {
      const nursePatients = getNursePatients(currentUser.id);
      setPatients(nursePatients);
      
      if (nursePatients.length > 0 && !selectedPatient) {
        setSelectedPatient(nursePatients[0]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedPatient) {
      const records = getPatientMedicationRecords(selectedPatient.id);
      setPatientRecords(records);
    }
  }, [selectedPatient]);

  const handleAddTimeOfDay = () => {
    setNewMedication({
      ...newMedication,
      timeOfDay: [...(newMedication.timeOfDay || []), '']
    });
  };

  const handleRemoveTimeOfDay = (index: number) => {
    const updatedTimes = [...(newMedication.timeOfDay || [])];
    updatedTimes.splice(index, 1);
    setNewMedication({
      ...newMedication,
      timeOfDay: updatedTimes
    });
  };

  const handleTimeOfDayChange = (index: number, value: string) => {
    const updatedTimes = [...(newMedication.timeOfDay || [])];
    updatedTimes[index] = value;
    setNewMedication({
      ...newMedication,
      timeOfDay: updatedTimes
    });
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) return;
    
    const newSchedule: MedicationSchedule = {
      id: `sched${Date.now()}`,
      patientId: selectedPatient.id,
      medicineName: newMedication.medicineName || '',
      dosage: newMedication.dosage || '',
      frequency: newMedication.frequency || 'daily',
      timeOfDay: newMedication.timeOfDay || ['08:00'],
      startDate: newMedication.startDate || new Date(),
      notes: newMedication.notes,
      createdBy: currentUser?.id || '',
    };
    
    createMedicationSchedule(newSchedule);
    
    // Reset form
    setNewMedication({
      medicineName: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: ['08:00'],
      startDate: new Date(),
      notes: '',
    });
    
    setShowAddMedicationModal(false);
    setSuccessMessage('Jadwal pengobatan berhasil ditambahkan');
    
    // Refresh patient data
    const nursePatients = getNursePatients(currentUser?.id || '');
    setPatients(nursePatients);
    
    if (selectedPatient) {
      const updatedPatient = nursePatients.find(p => p.id === selectedPatient.id);
      setSelectedPatient(updatedPatient || null);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const calculateAdherenceRate = (patientId: string): { rate: number, total: number } => {
    const records = getPatientMedicationRecords(patientId);
    if (records.length === 0) return { rate: 0, total: 0 };
    
    const takenCount = records.filter(record => record.taken).length;
    return { 
      rate: Math.round((takenCount / records.length) * 100),
      total: records.length
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Perawat</h1>
      
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-blue-900 text-white">
              <h3 className="text-lg font-medium">Daftar Pasien</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {patients.map((patient) => {
                const adherence = calculateAdherenceRate(patient.id);
                return (
                  <li key={patient.id}>
                    <button
                      type="button"
                      className={`w-full px-4 py-4 flex items-center hover:bg-gray-50 focus:outline-none ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-blue-900 text-left">
                          {patient.name}
                        </div>
                        <div className="mt-1 flex items-center">
                          <div className="text-xs text-gray-500">
                            Kepatuhan: {adherence.total > 0 ? `${adherence.rate}%` : 'N/A'}
                          </div>
                          {adherence.total > 0 && (
                            <div className="ml-2 bg-gray-200 rounded-full h-2 w-16">
                              <div
                                className={`h-2 rounded-full ${
                                  adherence.rate >= 80 
                                    ? 'bg-green-500' 
                                    : adherence.rate >= 50 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${adherence.rate}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedPatient ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedPatient.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Jadwal Pengobatan dan Kepatuhan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMedicationModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle className="-ml-0.5 mr-2 h-4 w-4" />
                  Tambah Obat
                </button>
              </div>
              
              {/* Medication Schedules */}
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Jadwal Pengobatan
                </h4>
                
                {selectedPatient.medicationSchedule.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada jadwal pengobatan untuk pasien ini.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedPatient.medicationSchedule.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-md font-medium text-gray-900">
                              {schedule.medicineName}
                            </h5>
                            <p className="text-sm text-gray-500">
                              Dosis: {schedule.dosage}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {schedule.frequency === 'daily' ? 'Harian' : schedule.frequency}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            Mulai: {new Date(schedule.startDate).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-start text-sm text-gray-700">
                            <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                            <div>
                              <p>Jadwal:</p>
                              <ul className="list-disc list-inside ml-2">
                                {schedule.timeOfDay.map((time, index) => (
                                  <li key={index}>{time}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        {schedule.notes && (
                          <div className="mt-2 text-sm text-gray-700">
                            <p className="font-medium">Catatan:</p>
                            <p>{schedule.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Medication Records */}
                <h4 className="text-md font-medium text-gray-900 mt-8 mb-4">
                  Riwayat Kepatuhan
                </h4>
                
                {patientRecords.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada data kepatuhan untuk pasien ini.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Obat
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Waktu Terjadwal
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Waktu Aktual
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Catatan
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patientRecords.map((record) => {
                          const schedule = selectedPatient.medicationSchedule.find(
                            (s) => s.id === record.scheduleId
                          );
                          
                          return (
                            <tr key={record.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {schedule?.medicineName || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(record.scheduledTime).toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    record.taken
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {record.taken ? 'Diminum' : 'Tidak Diminum'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.actualTime
                                  ? new Date(record.actualTime).toLocaleString('id-ID')
                                  : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.notes || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Activity className="h-12 w-12 text-blue-900 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Pilih pasien untuk melihat detail
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Pilih pasien dari daftar di sebelah kiri untuk melihat jadwal pengobatan dan kepatuhan.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircle className="h-6 w-6 text-blue-900" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Tambah Jadwal Obat
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleAddMedication}>
                        <div className="grid grid-cols-1 gap-y-4">
                          <div>
                            <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700">
                              Nama Obat
                            </label>
                            <input
                              type="text"
                              name="medicineName"
                              id="medicineName"
                              value={newMedication.medicineName || ''}
                              onChange={(e) => setNewMedication({ ...newMedication, medicineName: e.target.value })}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                              Dosis
                            </label>
                            <input
                              type="text"
                              name="dosage"
                              id="dosage"
                              value={newMedication.dosage || ''}
                              onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Contoh: 10mg"
                            />
                          </div>

                          <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                              Frekuensi
                            </label>
                            <select
                              id="frequency"
                              name="frequency"
                              value={newMedication.frequency || 'daily'}
                              onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="daily">Harian</option>
                              <option value="twice_daily">Dua kali sehari</option>
                              <option value="weekly">Mingguan</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Waktu Minum Obat
                            </label>
                            {newMedication.timeOfDay?.map((time, index) => (
                              <div key={index} className="flex mt-1 items-center">
                                <input
                                  type="time"
                                  value={time}
                                  onChange={(e) => handleTimeOfDayChange(index, e.target.value)}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTimeOfDay(index)}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={handleAddTimeOfDay}
                              className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              + Tambah Waktu
                            </button>
                          </div>

                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                              Tanggal Mulai
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              id="startDate"
                              value={newMedication.startDate ? new Date(newMedication.startDate).toISOString().substr(0, 10) : ''}
                              onChange={(e) => setNewMedication({ ...newMedication, startDate: new Date(e.target.value) })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Catatan
                            </label>
                            <textarea
                              id="notes"
                              name="notes"
                              rows={3}
                              value={newMedication.notes || ''}
                              onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Contoh: Minum setelah makan"
                            ></textarea>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMedicationModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;