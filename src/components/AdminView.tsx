
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'company';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface Scholarship {
  id: number;
  title: string;
  description: string;
  requirements: string;
  amount: string;
  deadline: string;
  status: 'active' | 'inactive';
  applications: number;
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

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    const saved = localStorage.getItem('scholarships');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Bourse d\'excellence',
        description: 'Bourse pour les étudiants ayant obtenu une moyenne supérieure à 16/20',
        requirements: 'Moyenne > 16, Lettre de motivation, Relevés de notes',
        amount: '5000 DZD/mois',
        deadline: '2024-06-30',
        status: 'active',
        applications: 3
      },
      {
        id: 2,
        title: 'Bourse sociale',
        description: 'Aide financière pour les étudiants issus de familles défavorisées',
        requirements: 'Justificatif de revenus, Situation familiale',
        amount: '3000 DZD/mois',
        deadline: '2024-07-15',
        status: 'active',
        applications: 5
      }
    ];
  });

  const [isScholarshipDialogOpen, setIsScholarshipDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [newScholarship, setNewScholarship] = useState<Partial<Scholarship>>({
    title: '',
    description: '',
    requirements: '',
    amount: '',
    deadline: '',
    status: 'active',
    applications: 0
  });

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
    activeScholarships: scholarships.filter(s => s.status === 'active').length,
    totalApplications: 42,
    scholarshipApplications: scholarships.reduce((sum, s) => sum + s.applications, 0),
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

  // Save scholarships to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  const handleAddScholarship = () => {
    const newId = Math.max(0, ...scholarships.map(s => s.id)) + 1;
    const scholarshipToAdd: Scholarship = {
      id: newId,
      title: newScholarship.title || 'Nouvelle bourse',
      description: newScholarship.description || '',
      requirements: newScholarship.requirements || '',
      amount: newScholarship.amount || '0 DZD/mois',
      deadline: newScholarship.deadline || new Date().toISOString().split('T')[0],
      status: 'active',
      applications: 0
    };

    setScholarships([...scholarships, scholarshipToAdd]);
    setNewScholarship({
      title: '',
      description: '',
      requirements: '',
      amount: '',
      deadline: '',
      status: 'active',
      applications: 0
    });
    setIsScholarshipDialogOpen(false);
    toast({
      title: 'Bourse ajoutée',
      description: 'La bourse a été ajoutée avec succès.',
    });
  };

  const handleUpdateScholarship = () => {
    if (!editingScholarship) return;
    
    setScholarships(scholarships.map(s => 
      s.id === editingScholarship.id ? { ...editingScholarship } : s
    ));
    
    setEditingScholarship(null);
    toast({
      title: 'Bourse mise à jour',
      description: 'Les modifications ont été enregistrées.',
    });
  };

  const handleDeleteScholarship = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bourse ?')) {
      setScholarships(scholarships.filter(s => s.id !== id));
      toast({
        title: 'Bourse supprimée',
        description: 'La bourse a été supprimée avec succès.',
      });
    }
  };

  const toggleScholarshipStatus = (id: number) => {
    setScholarships(scholarships.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ));
  };

  const openEditDialog = (scholarship: Scholarship) => {
    setEditingScholarship(JSON.parse(JSON.stringify(scholarship)));
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Bourses</h3>
            <p className="text-gray-600">Gérez les bourses d'études disponibles pour les étudiants</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold">Liste des Bourses</h4>
              <p className="text-sm text-muted-foreground">
                {scholarships.length} bourse(s) enregistrée(s)
              </p>
            </div>
            <Button onClick={() => {
              setEditingScholarship(null);
              setNewScholarship({
                title: '',
                description: '',
                requirements: '',
                amount: '',
                deadline: '',
                status: 'active',
                applications: 0
              });
              setIsScholarshipDialogOpen(true);
            }}>
              <span>➕</span>
              <span className="ml-2">Nouvelle bourse</span>
            </Button>
          </div>

          {scholarships.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Aucune bourse pour le moment</h3>
                <p className="text-muted-foreground mb-6">Commencez par ajouter votre première bourse d'études</p>
                <Button onClick={() => setIsScholarshipDialogOpen(true)}>
                  Ajouter une bourse
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date limite</TableHead>
                      <TableHead>Candidatures</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarships.map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell className="font-medium">{scholarship.title}</TableCell>
                        <TableCell>{scholarship.amount}</TableCell>
                        <TableCell>{new Date(scholarship.deadline).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{scholarship.applications}</TableCell>
                        <TableCell>
                          <Badge variant={scholarship.status === 'active' ? 'default' : 'secondary'}>
                            {scholarship.status === 'active' ? '🟢 Actif' : '🔴 Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(scholarship)}
                          >
                            Modifier
                          </Button>
                          <Button 
                            variant={scholarship.status === 'active' ? 'outline' : 'default'} 
                            size="sm"
                            onClick={() => toggleScholarshipStatus(scholarship.id)}
                          >
                            {scholarship.status === 'active' ? 'Désactiver' : 'Activer'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques des Bourses</CardTitle>
                  <CardDescription>Vue d'ensemble des bourses et candidatures</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-white">
                    <div className="text-3xl font-bold text-purple-600">{stats.activeScholarships}</div>
                    <p className="text-sm text-muted-foreground">Bourses actives</p>
                  </div>
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
                    <div className="text-3xl font-bold text-blue-600">{stats.scholarshipApplications}</div>
                    <p className="text-sm text-muted-foreground">Candidatures reçues</p>
                  </div>
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-white">
                    <div className="text-3xl font-bold text-green-600">{stats.scholarshipMatches}</div>
                    <p className="text-sm text-muted-foreground">Bourses attribuées</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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

      {/* Scholarship Form Dialog */}
      <Dialog open={isScholarshipDialogOpen || !!editingScholarship} onOpenChange={(open) => {
        if (!open) {
          setIsScholarshipDialogOpen(false);
          setEditingScholarship(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingScholarship ? 'Modifier la bourse' : 'Nouvelle bourse'}</DialogTitle>
            <DialogDescription>
              {editingScholarship ? 'Modifiez les détails de la bourse.' : 'Remplissez les détails de la nouvelle bourse.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Titre de la bourse</label>
              <Input
                id="title"
                placeholder="Ex: Bourse d'excellence"
                value={editingScholarship?.title || newScholarship.title || ''}
                onChange={(e) => {
                  if (editingScholarship) {
                    setEditingScholarship({...editingScholarship, title: e.target.value});
                  } else {
                    setNewScholarship({...newScholarship, title: e.target.value});
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Montant</label>
              <Input
                id="amount"
                placeholder="Ex: 5000 DZD/mois"
                value={editingScholarship?.amount || newScholarship.amount || ''}
                onChange={(e) => {
                  if (editingScholarship) {
                    setEditingScholarship({...editingScholarship, amount: e.target.value});
                  } else {
                    setNewScholarship({...newScholarship, amount: e.target.value});
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">Date limite de candidature</label>
              <Input
                id="deadline"
                type="date"
                value={editingScholarship?.deadline || newScholarship.deadline || ''}
                onChange={(e) => {
                  if (editingScholarship) {
                    setEditingScholarship({...editingScholarship, deadline: e.target.value});
                  } else {
                    setNewScholarship({...newScholarship, deadline: e.target.value});
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                placeholder="Décrivez la bourse en détail..."
                rows={4}
                value={editingScholarship?.description || newScholarship.description || ''}
                onChange={(e) => {
                  if (editingScholarship) {
                    setEditingScholarship({...editingScholarship, description: e.target.value});
                  } else {
                    setNewScholarship({...newScholarship, description: e.target.value});
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="requirements" className="text-sm font-medium">Conditions requises</label>
              <Textarea
                id="requirements"
                placeholder="Listez les conditions d'éligibilité..."
                rows={3}
                value={editingScholarship?.requirements || newScholarship.requirements || ''}
                onChange={(e) => {
                  if (editingScholarship) {
                    setEditingScholarship({...editingScholarship, requirements: e.target.value});
                  } else {
                    setNewScholarship({...newScholarship, requirements: e.target.value});
                  }
                }}
              />
            </div>
            
            {editingScholarship && (
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Statut</label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingScholarship.status}
                  onChange={(e) => setEditingScholarship({...editingScholarship, status: e.target.value as 'active' | 'inactive'})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsScholarshipDialogOpen(false);
                setEditingScholarship(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={editingScholarship ? handleUpdateScholarship : handleAddScholarship}
              disabled={!editingScholarship?.title && !newScholarship.title}
            >
              {editingScholarship ? 'Enregistrer les modifications' : 'Créer la bourse'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminView;
