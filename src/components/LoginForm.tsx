import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username dan password diperlukan');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      const success = await login(username, password);
      
      if (success) {
        // Redirect based on role
        if (username === 'admin') {
          navigate('/admin/dashboard');
        } else if (username.startsWith('perawat')) {
          navigate('/nurse/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      } else {
        setError('Username atau password salah');
      }
    } catch (err) {
      setError('Gagal login. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Activity className="h-20 w-20 text-blue-900" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            IMO MANTAP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistem Kepatuhan Minum Obat Hipertensi
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <p className="font-medium text-blue-900">
              Informasi Login Demo:
            </p>
            <div className="mt-1 text-gray-600">
              <p>Admin: username <strong>admin</strong>, password <strong>admin123</strong></p>
              <p>Perawat: username <strong>perawat1</strong>, password <strong>perawat123</strong></p>
              <p>Pasien: username <strong>pasien1</strong>, password <strong>pasien123</strong></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;