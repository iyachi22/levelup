
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import NotificationBell from './NotificationBell';
import ChatSupport from './ChatSupport';
import CompanyView from './CompanyView';
import ProfileDropdown from './ProfileDropdown';

interface CompanyDashboardProps {
  onLogout: () => void;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onLogout }) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-lg text-white">🏢</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LevelUp - Entreprise</h1>
                <p className="text-sm text-gray-500">Tableau de bord entreprise</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <NotificationBell /> */}
              <ProfileDropdown 
                user={{
                  name: 'Entreprise Demo',
                  email: 'contact@entreprise-dz.dz',
                  role: 'company',
                  avatarFallback: 'CO',
                  avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Company',
                  status: 'active',
                  lastLogin: 'Aujourd\'hui, 19:45',
                  accountCreated: '01/01/2024',
                  emailVerified: true,
                  phone: '+213 23 45 67 89',
                  location: 'Alger, Algérie'
                }}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CompanyView />
      </main>

      {/* Chat Support Button */}
      <Button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
        size="icon"
      >
        💬
      </Button>

      {/* Chat Support Panel */}
      {showChat && (
        <ChatSupport onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default CompanyDashboard;
