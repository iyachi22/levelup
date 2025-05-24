
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationBell: React.FC = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "Nouvelle candidature",
      message: "Ahmed a postulé pour le stage en développement",
      time: "Il y a 5 min",
      type: "application"
    },
    {
      id: 2,
      title: "Offre approuvée",
      message: "Votre offre de stage a été validée",
      time: "Il y a 1h",
      type: "success"
    },
    {
      id: 3,
      title: "Message administrateur",
      message: "Mise à jour des conditions d'utilisation",
      time: "Il y a 2h",
      type: "info"
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application': return '📋';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-all duration-200">
          🔔
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500">
            {notifications.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t bg-gray-50">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                Voir toutes les notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
