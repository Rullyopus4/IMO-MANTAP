import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, ShieldCheck, UserCog } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  const roleTranslation = {
    admin: 'Administrator',
    nurse: 'Perawat',
    patient: 'Pasien',
  };

  // Placeholder for password change functionality
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be an API call in a real application
    setSuccessMessage('Password berhasil diubah!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Pengguna</h1>
      
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-blue-900 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white flex items-center justify-center">
              <User className="h-8 w-8 text-blue-900" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium leading-6">
                {currentUser.name}
              </h3>
              <p className="text-sm flex items-center mt-1">
                <ShieldCheck className="h-4 w-4 mr-1" />
                {currentUser.role === 'admin' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    {roleTranslation[currentUser.role]}
                  </span>
                ) : currentUser.role === 'nurse' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                    {roleTranslation[currentUser.role]}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                    {roleTranslation[currentUser.role]}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.username}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Peran</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {roleTranslation[currentUser.role]}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tanggal Bergabung</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(currentUser.createdAt).toLocaleDateString('id-ID')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Change Password Form */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <UserCog className="h-5 w-5 mr-2" />
            Ubah Password
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleChangePassword}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Password Saat Ini
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password Baru
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ubah Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;