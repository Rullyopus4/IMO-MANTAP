import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import NurseDashboard from './components/NurseDashboard';
import PatientDashboard from './components/PatientDashboard';
import MessageCenter from './components/MessageCenter';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/nurse/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['nurse']}>
                            <NurseDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/patient/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['patient']}>
                            <PatientDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/messages"
                        element={
                          <ProtectedRoute>
                            <MessageCenter />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                      />
                    </Routes>
                  </main>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;