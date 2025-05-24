import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield, Calendar, Settings, HelpCircle, LogOut, User, CheckCircle2, Clock, Ban } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'company' | 'student';
  avatarFallback: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  accountCreated: string;
  emailVerified: boolean;
  phone?: string;
  location?: string;
}

interface ProfileDropdownProps {
  user: UserProfile;
  onLogout?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get role display info
  const getRoleInfo = () => {
    switch(user.role) {
      case 'admin':
        return { label: 'Administrateur', icon: <Shield className="h-4 w-4 text-purple-600" /> };
      case 'company':
        return { label: 'Entreprise', icon: <span className="h-4 w-4">🏢</span> };
      case 'student':
      default:
        return { label: 'Étudiant', icon: <span className="h-4 w-4">👨‍🎓</span> };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.avatarFallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        {/* Header with user info */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b">
          <div className="flex items-start space-x-3">
            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {user.avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 truncate">{user.name}</h3>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  {roleInfo.icon}
                  {roleInfo.label}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                <span className="truncate">{user.email}</span>
                {user.emailVerified ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircle2 className="h-3.5 w-3.5 ml-1.5 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right">Email vérifié</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Clock className="h-3.5 w-3.5 ml-1.5 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right">Email non vérifié</TooltipContent>
                  </Tooltip>
                )}
              </div>
              {user.phone && (
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span className="text-xs text-gray-400 mr-1.5">📱</span>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account status */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Statut du compte</span>
            <Badge 
              variant={user.status === 'active' ? 'default' : 
                      user.status === 'pending' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {user.status === 'active' && 'Actif'}
              {user.status === 'pending' && 'En attente'}
              {user.status === 'inactive' && 'Inactif'}
              {user.status === 'suspended' && 'Suspendu'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              <span>Créé le {user.accountCreated}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-gray-400 mr-1.5">🔒</span>
              <span>Dernière connexion: {user.lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>Mon profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span>Paramètres du compte</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span>Aide & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        {/* Footer with logout */}
        <DropdownMenuItem 
          onClick={onLogout}
          className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md px-3 py-2 m-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
