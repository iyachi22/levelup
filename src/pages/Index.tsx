
import React, { useState } from 'react';
import RoleSelector from '@/components/RoleSelector';
import StudentLogin from '@/components/StudentLogin';
import CompanyLogin from '@/components/CompanyLogin';
import AdminLogin from '@/components/AdminLogin';
import StudentDashboard from '@/components/StudentDashboard';
import CompanyDashboard from '@/components/CompanyDashboard';
import AdminDashboard from '@/components/AdminDashboard';

type UserRole = 'student' | 'company' | 'admin';
type AppState = 'role-selection' | 'login' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('login');
  };

  const handleLogin = () => {
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setAppState('role-selection');
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setAppState('role-selection');
  };

  if (appState === 'role-selection') {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  if (appState === 'login') {
    switch (selectedRole) {
      case 'student':
        return <StudentLogin onLogin={handleLogin} onBack={handleBackToRoleSelection} />;
      case 'company':
        return <CompanyLogin onLogin={handleLogin} onBack={handleBackToRoleSelection} />;
      case 'admin':
        return <AdminLogin onLogin={handleLogin} onBack={handleBackToRoleSelection} />;
      default:
        return <RoleSelector onRoleSelect={handleRoleSelect} />;
    }
  }

  if (appState === 'dashboard') {
    switch (selectedRole) {
      case 'student':
        return <StudentDashboard onLogout={handleLogout} />;
      case 'company':
        return <CompanyDashboard onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return <RoleSelector onRoleSelect={handleRoleSelect} />;
    }
  }

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
};

export default Index;
