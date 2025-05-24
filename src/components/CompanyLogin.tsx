
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompanyLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const CompanyLogin: React.FC<CompanyLoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('entreprise@levelup.com');
  const [password, setPassword] = useState('entreprise123');
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    sector: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
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
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
                    'Se connecter'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="put your company name"
                    value={registerData.companyName}
                    onChange={(e) => setRegisterData(prev => ({...prev, companyName: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="put your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité</Label>
                  <Input
                    id="sector"
                    type="text"
                    placeholder="Informatique, Finance..."
                    value={registerData.sector}
                    onChange={(e) => setRegisterData(prev => ({...prev, sector: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Mot de passe</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({...prev, password: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({...prev, confirmPassword: e.target.value}))}
                    required
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
                      <span>Inscription...</span>
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="w-full mt-4"
          >
            Retour
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Compte par défaut: entreprise@levelup.com / entreprise123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyLogin;
