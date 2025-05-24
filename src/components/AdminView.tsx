
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'company';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface Feedback {
  id: number;
  user: string;
  message: string;
  rating: number;
  date: string;
  type: 'suggestion' | 'bug' | 'compliment';
}

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Yasmine Benali", email: "yasmine@levelup.com", role: "student", status: "active", joinDate: "2024-01-10" },
    { id: 2, name: "Ahmed Khelil", email: "ahmed.k@email.com", role: "student", status: "active", joinDate: "2024-01-12" },
    { id: 3, name: "TechAlger", email: "contact@techalger.com", role: "company", status: "active", joinDate: "2024-01-05" },
    { id: 4, name: "Salma Meziani", email: "salma.m@email.com", role: "student", status: "inactive", joinDate: "2023-12-20" },
    { id: 5, name: "DataCorp", email: "rh@datacorp.dz", role: "company", status: "active", joinDate: "2024-01-08" }
  ]);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: 1, user: "Yasmine B.", message: "Excellente plateforme! J'ai trouvé mon stage rapidement.", rating: 5, date: "2024-01-15", type: "compliment" },
    { id: 2, user: "Ahmed K.", message: "Il serait bien d'ajouter un système de notification push.", rating: 4, date: "2024-01-14", type: "suggestion" },
    { id: 3, user: "TechAlger", message: "Interface très intuitive pour gérer nos candidatures.", rating: 5, date: "2024-01-13", type: "compliment" },
    { id: 4, user: "Salma M.", message: "Problème avec l'upload de CV sur mobile.", rating: 2, date: "2024-01-12", type: "bug" }
  ]);

  const stats = {
    students: users.filter(u => u.role === 'student').length,
    companies: users.filter(u => u.role === 'company').length,
    totalUsers: users.length,
    activeOffers: 15,
    activeScholarships: 7,
    totalApplications: 42,
    scholarshipApplications: 18,
    successfulMatches: 8,
    scholarshipMatches: 3
  };

  const handleUserAction = (userId: number, action: 'activate' | 'deactivate' | 'delete') => {
    setIsLoading(true);
    setTimeout(() => {
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé du système.",
        });
      } else {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, status: action === 'activate' ? 'active' : 'inactive' }
              : user
          )
        );
        toast({
          title: `Utilisateur ${action === 'activate' ? 'activé' : 'désactivé'}`,
          description: "Le statut de l'utilisateur a été mis à jour.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'company': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch(type) {
      case 'compliment': return 'bg-green-100 text-green-800';
      case 'suggestion': return 'bg-blue-100 text-blue-800';
      case 'bug': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">⚙️ Administration LevelUp</h2>
          <p className="text-gray-600">Tableau de bord administrateur</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <span>📊</span>
            <span>Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <span>👥</span>
            <span>Utilisateurs ({stats.totalUsers})</span>
          </TabsTrigger>
          <TabsTrigger value="bourses" className="flex items-center space-x-2">
            <span>🏆</span>
            <span>Bourses</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center space-x-2">
            <span>💬</span>
            <span>Feedbacks ({feedbacks.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Statistiques Générales</h3>
            <p className="text-gray-600">Vue d'ensemble de la plateforme LevelUp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                <span className="text-2xl">👨‍🎓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.students}</div>
                <p className="text-xs text-muted-foreground">inscrits sur la plateforme</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
                <span className="text-2xl">🏢</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.companies}</div>
                <p className="text-xs text-muted-foreground">partenaires actifs</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
                <span className="text-2xl">📄</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.activeOffers}</div>
                <p className="text-xs text-muted-foreground">stages et bourses disponibles</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                <span className="text-2xl">📋</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">candidatures reçues</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches Réussis</CardTitle>
                <span className="text-2xl">🎯</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.successfulMatches}</div>
                <p className="text-xs text-muted-foreground">stages et bourses attribués</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                <span className="text-2xl">📈</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((stats.successfulMatches / stats.totalApplications) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">candidatures acceptées</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Gestion des Utilisateurs</h3>
            <p className="text-gray-600">Gérez les comptes étudiants et entreprises</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === 'student' ? '👨‍🎓 Étudiant' : '🏢 Entreprise'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === 'active' ? '🟢 Actif' : '🔴 Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, user.status === 'active' ? 'deactivate' : 'activate')}
                            disabled={isLoading}
                          >
                            {user.status === 'active' ? 'Désactiver' : 'Activer'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            disabled={isLoading}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bourses" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Gestion des Bourses</h3>
            <p className="text-gray-600">Gérez les bourses d'études disponibles</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Liste des Bourses</CardTitle>
                <Button>
                  <span>➕</span>
                  <span className="ml-2">Ajouter une bourse</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border
                flex items-center justify-center p-12 text-center text-muted-foreground">
                <div className="space-y-2">
                  <div className="text-4xl">🏆</div>
                  <p className="font-medium">Aucune bourse pour le moment</p>
                  <p className="text-sm">Commencez par ajouter votre première bourse d'études</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques des Bourses</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.activeScholarships}</div>
                <p className="text-sm text-muted-foreground">Bourses actives</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.scholarshipApplications}</div>
                <p className="text-sm text-muted-foreground">Candidatures reçues</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.scholarshipMatches}</div>
                <p className="text-sm text-muted-foreground">Bourses attribuées</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Feedbacks Utilisateurs</h3>
            <p className="text-gray-600">Consultez les retours et suggestions des utilisateurs</p>
          </div>

          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{feedback.user}</h4>
                        <Badge className={getFeedbackTypeColor(feedback.type)}>
                          {feedback.type === 'compliment' && '👏 Compliment'}
                          {feedback.type === 'suggestion' && '💡 Suggestion'}
                          {feedback.type === 'bug' && '🐛 Bug'}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{feedback.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {feedback.date}</span>
                        <span>{getRatingStars(feedback.rating)} ({feedback.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminView;
