import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout, isAdmin, isNurse, isPatient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 mr-2" />
            <Link to="/" className="font-bold text-xl">
              IMO MANTAP
            </Link>
          </div>
          <div className="flex items-center">
            {isAdmin() && (
              <Link 
                to="/admin/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Dashboard Admin
              </Link>
            )}
            {isNurse() && (
              <Link 
                to="/nurse/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Dashboard Perawat
              </Link>
            )}
            {isPatient() && (
              <Link 
                to="/patient/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Dashboard Pasien
              </Link>
            )}
            <Link 
              to="/messages" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              Pesan
            </Link>
            <div className="ml-3 relative group">
              <div className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 cursor-pointer">
                <User className="h-5 w-5 mr-1" />
                <span>{currentUser.name}</span>
              </div>
              <div className="hidden group-hover:block absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Keluar</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;