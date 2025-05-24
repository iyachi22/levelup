
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleSelectorProps {
  onRoleSelect: (role: 'student' | 'company' | 'admin') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-lg relative z-10 shadow-2xl animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">LU</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bienvenue sur LevelUp
          </CardTitle>
          <p className="text-gray-600">
            Choisissez votre type de compte
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={() => onRoleSelect('student')}
            className="w-full h-16 text-lg flex items-center space-x-3 hover:scale-105 transition-all duration-200"
            variant="outline"
          >
            <span className="text-2xl">👨‍🎓</span>
            <span>Étudiant</span>
          </Button>
          
          <Button 
            onClick={() => onRoleSelect('company')}
            className="w-full h-16 text-lg flex items-center space-x-3 hover:scale-105 transition-all duration-200"
            variant="outline"
          >
            <span className="text-2xl">🏢</span>
            <span>Entreprise</span>
          </Button>
          
          <Button 
            onClick={() => onRoleSelect('admin')}
            className="w-full h-16 text-lg flex items-center space-x-3 hover:scale-105 transition-all duration-200"
            variant="outline"
          >
            <span className="text-2xl">⚙️</span>
            <span>Administrateur</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
