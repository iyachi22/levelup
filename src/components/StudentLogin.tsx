
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface StudentLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Removed registration state as it's no longer needed

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  // Removed handleRegister function as it's no longer needed
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl animate-bounce-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">👨‍🎓</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Espace Étudiant
          </CardTitle>
          <p className="text-gray-600">
            Accédez à vos opportunités de stage et bourses
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
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 transition-all duration-200 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="w-full mt-4"
          >
            Retour
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Compte Yasmine: Yasmine@levelup.com / yasmine123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;
