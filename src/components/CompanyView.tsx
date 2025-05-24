
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface JobOffer {
  id: number;
  title: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  status: 'active' | 'inactive';
  applications: number;
  type: 'stage' | 'bourse';
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  skills: string[];
  appliedFor: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  cvFile: string;
  motivationLetter: string;
}

const CompanyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('offers');
  const [isLoading, setIsLoading] = useState(false);

  // Get shared state from localStorage
  const getOffers = (): JobOffer[] => {
    const stored = localStorage.getItem('levelup_offers');
    if (stored) {
      return JSON.parse(stored);
    }
    const defaultOffers = [
      {
        id: 1,
        title: "Stage en développement web",
        location: "Alger",
        description: "Développement d'applications web modernes avec React et Node.js",
        requirements: "Étudiant en informatique, connaissances en JavaScript",
        salary: "15,000 DA/mois",
        status: 'active' as const,
        applications: 3,
        type: 'stage' as const
      }
    ];
    localStorage.setItem('levelup_offers', JSON.stringify(defaultOffers));
    return defaultOffers;
  };

  const getCandidates = (): Candidate[] => {
    const applications = localStorage.getItem('levelup_applications');
    if (applications) {
      const parsedApplications = JSON.parse(applications);
      return parsedApplications.map((app: any, index: number) => ({
        id: app.id || index + 1,
        name: "Yasmine Benali",
        email: "yasmine@levelup.com",
        skills: ["JavaScript", "React", "Node.js", "HTML/CSS"],
        appliedFor: app.offerTitle,
        status: app.status === 'approuve' ? 'approved' : app.status === 'refuse' ? 'rejected' : 'pending',
        appliedDate: app.appliedDate,
        cvFile: "yasmine_benali_cv.pdf",
        motivationLetter: "Je suis très motivée par cette opportunité de stage chez TechAlger. En tant qu'étudiante en informatique, je souhaite mettre en pratique mes connaissances en développement web..."
      }));
    }
    return [];
  };

  const [offers, setOffers] = useState<JobOffer[]>(getOffers());
  const [candidates, setCandidates] = useState<Candidate[]>(getCandidates());

  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null);

  const [newOffer, setNewOffer] = useState({
    title: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'stage' as 'stage' | 'bourse'
  });

  // Refresh candidates when tab changes
  React.useEffect(() => {
    if (activeTab === 'candidates') {
      setCandidates(getCandidates());
    }
  }, [activeTab]);

  const handleCandidateAction = (candidateId: number, action: 'approved' | 'rejected') => {
    setIsLoading(true);
    setTimeout(() => {
      // Update local candidates state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status: action }
            : candidate
        )
      );

      // Update applications in localStorage
      const applications = localStorage.getItem('levelup_applications');
      if (applications) {
        const parsedApplications = JSON.parse(applications);
        const updatedApplications = parsedApplications.map((app: any) => 
          app.id === candidateId 
            ? { ...app, status: action === 'approved' ? 'approuve' : 'refuse' }
            : app
        );
        localStorage.setItem('levelup_applications', JSON.stringify(updatedApplications));
      }

      setIsLoading(false);
      toast({
        title: action === 'approved' ? "Candidature approuvée!" : "Candidature refusée",
        description: `La candidature de Yasmine a été ${action === 'approved' ? 'approuvée' : 'refusée'}.`,
      });
    }, 1000);
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au minimum le titre et la description.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (editingOffer) {
        // Update existing offer
        const updatedOffers = offers.map(offer => 
          offer.id === editingOffer.id ? { ...newOffer, id: editingOffer.id, status: editingOffer.status, applications: editingOffer.applications } as JobOffer : offer
        );
        setOffers(updatedOffers);
        localStorage.setItem('levelup_offers', JSON.stringify(updatedOffers));
        setEditingOffer(null);
        
        toast({
          title: "Offre mise à jour!",
          description: "Votre offre a été modifiée avec succès.",
        });
      } else {
        // Add new offer
        const offer: JobOffer = {
          id: Date.now(),
          ...newOffer,
          status: 'active',
          applications: 0,
          type: 'stage' // Force type to be 'stage'
        };
        
        const updatedOffers = [...offers, offer];
        setOffers(updatedOffers);
        localStorage.setItem('levelup_offers', JSON.stringify(updatedOffers));
        
        toast({
          title: "Offre publiée!",
          description: "Votre offre a été publiée avec succès.",
        });
      }
      
      // Reset form
      setNewOffer({ title: '', location: '', description: '', requirements: '', salary: '', type: 'stage' });
      setIsLoading(false);
      setActiveTab('offers');
    }, 500);
  };

  const handleEditOffer = (offer: JobOffer) => {
    setEditingOffer(offer);
    setNewOffer({
      title: offer.title,
      location: offer.location,
      description: offer.description,
      requirements: offer.requirements,
      salary: offer.salary,
      type: offer.type
    });
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = (id: number) => {
    const updatedOffers = offers.map(offer => 
      offer.id === id 
        ? { ...offer, status: offer.status === 'active' ? 'inactive' : 'active' } as JobOffer
        : offer
    );
    setOffers(updatedOffers);
    localStorage.setItem('levelup_offers', JSON.stringify(updatedOffers));
    
    const updatedOffer = updatedOffers.find(offer => offer.id === id);
    if (updatedOffer) {
      toast({
        title: `Offre ${updatedOffer.status === 'active' ? 'activée' : 'désactivée'}`,
        description: `L'offre a été ${updatedOffer.status === 'active' ? 'activée' : 'désactivée'} avec succès.`,
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setOfferToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOffer = () => {
    if (!offerToDelete) return;
    
    const updatedOffers = offers.filter(offer => offer.id !== offerToDelete);
    setOffers(updatedOffers);
    localStorage.setItem('levelup_offers', JSON.stringify(updatedOffers));
    
    toast({
      title: "Offre supprimée",
      description: "L'offre a été supprimée avec succès.",
    });
    
    setIsDeleteDialogOpen(false);
    setOfferToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return '⏳ En attente';
      case 'approved': return '✅ Approuvée';
      case 'rejected': return '❌ Refusée';
      case 'active': return '🟢 Active';
      case 'inactive': return '⭕ Inactive';
      default: return status;
    }
  };

  const pendingCount = candidates.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🏢 TechAlger - Espace Entreprise</h2>
          <p className="text-gray-600">Gérez vos offres et candidatures</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="offers" className="flex items-center space-x-2">
            <span>📄</span>
            <span>Mes annonces ({offers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="candidates" className="flex items-center space-x-2">
            <span>👥</span>
            <span>Candidatures ({candidates.length})</span>
            {pendingCount > 0 && (
              <Badge className="ml-1 bg-red-500 text-white text-xs px-1 py-0 min-w-4 h-4">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center space-x-2">
            <span>➕</span>
            <span>Nouvelle offre</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Mes Annonces</h3>
            <p className="text-gray-600">Gérez vos offres d'emploi et de stage</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <Badge className={getStatusColor(offer.status)}>
                      {getStatusText(offer.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">📍 {offer.location}</p>
                    <p className="text-sm text-green-600 font-medium">💰 {offer.salary}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      📊 {offer.applications} candidature(s)
                    </span>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditOffer(offer)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(offer.id)}
                      >
                        {offer.status === 'active' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteClick(offer.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Candidatures Reçues</h3>
            <p className="text-gray-600">Évaluez et gérez les candidatures</p>
          </div>

          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{candidate.name}</h4>
                      <p className="text-gray-600">{candidate.email}</p>
                      <p className="text-sm text-gray-500">Postulé pour: {candidate.appliedFor}</p>
                      <p className="text-sm text-gray-500">Date: {candidate.appliedDate}</p>
                    </div>
                    <Badge className={getStatusColor(candidate.status)}>
                      {getStatusText(candidate.status)}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Compétences:</h5>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm">
                      <strong>CV:</strong> 
                      <Button variant="link" className="p-0 h-auto ml-2 text-blue-600">
                        📄 {candidate.cvFile}
                      </Button>
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mb-4">
                        Voir la lettre de motivation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Lettre de motivation - {candidate.name}</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-60 overflow-y-auto">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {candidate.motivationLetter}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {candidate.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleCandidateAction(candidate.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={isLoading}
                      >
                        {isLoading ? '⏳' : '✅'} Approuver
                      </Button>
                      <Button 
                        onClick={() => handleCandidateAction(candidate.id, 'rejected')}
                        variant="destructive"
                        disabled={isLoading}
                      >
                        {isLoading ? '⏳' : '❌'} Refuser
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ajouter une Nouvelle Offre</h3>
            <p className="text-gray-600">Créez une nouvelle offre d'emploi ou de stage</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du poste *</Label>
                  <Input
                    id="title"
                    placeholder="ex: Stage développeur React"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer(prev => ({...prev, title: e.target.value}))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type d'offre</Label>
                  <Input
                    id="type"
                    value="Stage"
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Seuls les stages sont autorisés pour le moment.</p>
                </div>

                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    placeholder="ex: Alger, Algérie"
                    value={newOffer.location}
                    onChange={(e) => setNewOffer(prev => ({...prev, location: e.target.value}))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                    value={newOffer.description}
                    onChange={(e) => setNewOffer(prev => ({...prev, description: e.target.value}))}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Prérequis et compétences</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Formation requise, compétences techniques, expérience..."
                    value={newOffer.requirements}
                    onChange={(e) => setNewOffer(prev => ({...prev, requirements: e.target.value}))}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="salary">Rémunération</Label>
                  <Input
                    id="salary"
                    placeholder="ex: 15,000 DA/mois"
                    value={newOffer.salary}
                    onChange={(e) => setNewOffer(prev => ({...prev, salary: e.target.value}))}
                    className="mt-1"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleAddOffer}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{editingOffer ? 'Mise à jour...' : 'Publication...'}</span>
                      </div>
                    ) : editingOffer ? (
                      'Mettre à jour l\'offre'
                    ) : (
                      'Publier l\'offre'
                    )}
                  </Button>
                  {editingOffer && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingOffer(null);
                        setNewOffer({ title: '', location: '', description: '', requirements: '', salary: '', type: 'stage' });
                      }}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr de vouloir supprimer cette offre ?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Cette action est irréversible et supprimera définitivement l'offre.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteOffer}>
              Supprimer définitivement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyView;
