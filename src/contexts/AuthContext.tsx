import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin, Nurse, Patient } from '../types';
import { admins, nurses, patients } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isNurse: () => boolean;
  isPatient: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for saved login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const allUsers = [...admins, ...nurses, ...patients];
    const user = allUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => currentUser?.role === 'admin';
  const isNurse = () => currentUser?.role === 'nurse';
  const isPatient = () => currentUser?.role === 'patient';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        isNurse,
        isPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};