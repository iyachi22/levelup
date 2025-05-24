
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const CompanyLogin: React.FC<CompanyLoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl animate-bounce-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Espace Entreprise
          </CardTitle>
          <p className="text-gray-600">
            Publiez vos offres et gérez vos candidatures
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="put your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 transition-all duration-200 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <Button 
            type="button" 
            variant="ghost" 
            className="w-full mt-4 text-blue-500 hover:bg-blue-50"
            onClick={onBack}
          >
            ← Retour au choix du profil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyLogin;
