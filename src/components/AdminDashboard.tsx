import React, { useState } from 'react';
import { User, UserPlus, Users } from 'lucide-react';
import { createUser, getAllUsers } from '../data/mockData';
import { User as UserType, Nurse, Patient } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'create'>('users');
  const [users, setUsers] = useState<UserType[]>(getAllUsers());
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    role: 'nurse' as 'nurse' | 'patient',
    nurseId: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const nurses = users.filter(user => user.role === 'nurse');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newUser.username || !newUser.password || !newUser.name) {
      setErrorMessage('Semua field wajib diisi');
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === newUser.username)) {
      setErrorMessage('Username sudah digunakan');
      return;
    }

    try {
      const currentDate = new Date();
      const userId = `${newUser.role}${users.filter(u => u.role === newUser.role).length + 1}`;
      
      if (newUser.role === 'nurse') {
        const nurse: Nurse = {
          id: userId,
          username: newUser.username,
          password: newUser.password, // In a real app, this should be hashed
          name: newUser.name,
          role: 'nurse',
          createdAt: currentDate,
          patients: [],
        };
        createUser(nurse);
      } else {
        // Ensure nurseId is selected for patient
        if (!newUser.nurseId) {
          setErrorMessage('Pilih perawat untuk pasien');
          return;
        }

        const patient: Patient = {
          id: userId,
          username: newUser.username,
          password: newUser.password, // In a real app, this should be hashed
          name: newUser.name,
          role: 'patient',
          createdAt: currentDate,
          nurseId: newUser.nurseId,
          medicationSchedule: [],
        };
        createUser(patient);
      }

      // Reset form and show success message
      setNewUser({
        username: '',
        password: '',
        name: '',
        role: 'nurse',
        nurseId: '',
      });
      setSuccessMessage(`${newUser.role === 'nurse' ? 'Perawat' : 'Pasien'} berhasil dibuat`);
      setErrorMessage('');
      
      // Refresh users list
      setUsers(getAllUsers());
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Gagal membuat pengguna');
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline-block h-5 w-5 mr-2" />
              Daftar Pengguna
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="inline-block h-5 w-5 mr-2" />
              Buat Pengguna Baru
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'users' ? (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Daftar Pengguna</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nama
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Peran
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tanggal Dibuat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                              <User className="h-6 w-6 text-blue-900" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'nurse'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'nurse' ? 'Perawat' : 'Pasien'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Buat Pengguna Baru</h2>
              
              {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleCreateUser}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nama Lengkap
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Peran
                    </label>
                    <div className="mt-1">
                      <select
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'nurse' | 'patient' })}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="nurse">Perawat</option>
                        <option value="patient">Pasien</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {newUser.role === 'patient' && (
                    <div className="sm:col-span-6">
                      <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">
                        Perawat yang Bertanggung Jawab
                      </label>
                      <div className="mt-1">
                        <select
                          id="nurseId"
                          name="nurseId"
                          value={newUser.nurseId}
                          onChange={(e) => setNewUser({ ...newUser, nurseId: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Pilih Perawat</option>
                          {nurses.map((nurse) => (
                            <option key={nurse.id} value={nurse.id}>
                              {nurse.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Buat Pengguna
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;