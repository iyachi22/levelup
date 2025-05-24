
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import NotificationBell from './NotificationBell';
import ChatSupport from './ChatSupport';
import AdminView from './AdminView';
import ProfileDropdown from './ProfileDropdown';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-lg text-white">⚙️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LevelUp - Administration</h1>
                <p className="text-sm text-gray-500">Tableau de bord administrateur</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <NotificationBell /> */}
              <ProfileDropdown 
                user={{
                  name: 'Admin Demo',
                  email: 'admin@demo.com',
                  role: 'admin',
                  avatarFallback: 'AD',
                  status: 'active',
                  lastLogin: 'Aujourd\'hui, 19:45'
                }}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminView />
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

export default AdminDashboard;
