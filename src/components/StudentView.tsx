
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Offer {
  id: number;
  title: string;
  location: string;
  company: string;
  type: 'stage' | 'bourse';
  description: string;
  requirements: string;
  salary?: string;
}

interface Application {
  id: number;
  offerTitle: string;
  company: string;
  status: 'en-attente' | 'approuve' | 'refuse';
  appliedDate: string;
}

const StudentView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOfferSet, setCurrentOfferSet] = useState(0);
  const [applicationData, setApplicationData] = useState({
    cv: '',
    motivationLetter: ''
  });

  // Get shared state from localStorage
  const getApplications = (): Application[] => {
    const stored = localStorage.getItem('levelup_applications');
    return stored ? JSON.parse(stored) : [];
  };

  const getOffers = (): Offer[] => {
    const stored = localStorage.getItem('levelup_offers');
    if (stored) {
      return JSON.parse(stored);
    }
    // Default offers
    const defaultOffers = [
      {
        id: 1,
        title: "Stage en développement web",
        location: "Alger",
        company: "TechAlger",
        type: "stage" as const,
        description: "Développement d'applications web modernes avec React et Node.js. Rejoignez notre équipe dynamique!",
        requirements: "Étudiant en informatique, connaissances en JavaScript, React souhaité",
        salary: "15,000 DA/mois"
      }
    ];
    localStorage.setItem('levelup_offers', JSON.stringify(defaultOffers));
    return defaultOffers;
  };

  const [applications, setApplications] = useState<Application[]>(getApplications());
  const [activeTab, setActiveTab] = useState('offers');

  const offerSets = [
    getOffers(),
    [],
    getOffers()
  ];

  const refreshOffers = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentOfferSet((prev) => (prev + 1) % offerSets.length);
      setIsLoading(false);
      toast({
        title: "Offres mises à jour!",
        description: "La liste des offres a été actualisée.",
      });
    }, 1500);
  };

  const handleApplication = (offer: Offer) => {
    if (!applicationData.motivationLetter.trim()) {
      toast({
        title: "Lettre de motivation requise",
        description: "Veuillez rédiger une lettre de motivation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newApplication: Application = {
        id: Date.now(),
        offerTitle: offer.title,
        company: offer.company,
        status: 'en-attente',
        appliedDate: new Date().toLocaleDateString('fr-FR')
      };
      
      const updatedApplications = [...applications, newApplication];
      setApplications(updatedApplications);
      localStorage.setItem('levelup_applications', JSON.stringify(updatedApplications));
      
      setIsLoading(false);
      toast({
        title: "Candidature envoyée avec succès!",
        description: `Votre candidature pour ${offer.title} chez ${offer.company} a été transmise.`,
      });
      setApplicationData({ cv: '', motivationLetter: '' });
      setActiveTab('applications');
    }, 2000);
  };

  // Refresh applications from localStorage when tab changes
  React.useEffect(() => {
    if (activeTab === 'applications') {
      setApplications(getApplications());
    }
  }, [activeTab]);

  const currentOffers = offerSets[currentOfferSet];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'en-attente': return 'bg-yellow-100 text-yellow-800';
      case 'approuve': return 'bg-green-100 text-green-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'en-attente': return '⏳ En attente';
      case 'approuve': return '✅ Approuvée';
      case 'refuse': return '❌ Refusée';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👋 Bonjour Yasmine!</h2>
          <p className="text-gray-600">Découvrez vos opportunités de carrière</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="offers" className="flex items-center space-x-2">
            <span>🎯</span>
            <span>Offres disponibles</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center space-x-2">
            <span>📋</span>
            <span>Mes candidatures ({applications.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Offres de Stage et Bourses</h3>
              <p className="text-gray-600">Trouvez l'opportunité parfaite pour votre carrière</p>
            </div>
            <Button 
              onClick={refreshOffers}
              disabled={isLoading}
              className="hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </div>
              ) : (
                '🔄 Rafraîchir les offres'
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : currentOffers.length === 0 ? (
            <Card className="text-center py-12 animate-bounce-in">
              <CardContent>
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2">Aucune offre disponible</h3>
                <p className="text-gray-600">Aucune offre disponible pour le moment.</p>
                <p className="text-sm text-gray-500 mt-2">Revenez plus tard ou rafraîchissez la page</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOffers.map((offer) => (
                <Card key={offer.id} className="card-hover animate-fade-in hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <Badge variant={offer.type === 'stage' ? 'default' : 'secondary'}>
                        {offer.type === 'stage' ? '💼 Stage' : '🎓 Bourse'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">📍 {offer.location}</p>
                      <p className="text-sm font-medium text-primary">{offer.company}</p>
                      {offer.salary && (
                        <p className="text-sm text-green-600 font-medium">💰 {offer.salary}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      <strong>Prérequis:</strong> {offer.requirements}
                    </p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full hover:scale-105 transition-all duration-200">
                          Postuler maintenant
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Candidature - {offer.title}</DialogTitle>
                          <p className="text-sm text-gray-600">{offer.company} • {offer.location}</p>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cv">CV (Fichier)</Label>
                            <Input
                              id="cv"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="mt-1"
                              onChange={(e) => setApplicationData(prev => ({
                                ...prev,
                                cv: e.target.files?.[0]?.name || ''
                              }))}
                            />
                            <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX</p>
                          </div>
                          <div>
                            <Label htmlFor="motivation">Lettre de motivation *</Label>
                            <Textarea
                              id="motivation"
                              placeholder="Expliquez votre motivation pour ce poste..."
                              value={applicationData.motivationLetter}
                              onChange={(e) => setApplicationData(prev => ({
                                ...prev,
                                motivationLetter: e.target.value
                              }))}
                              className="mt-1"
                              rows={4}
                              required
                            />
                          </div>
                          <Button 
                            onClick={() => handleApplication(offer)}
                            className="w-full"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Envoi en cours...</span>
                              </div>
                            ) : (
                              'Envoyer la candidature'
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Mes Candidatures</h3>
            <p className="text-gray-600">Suivez l'état de vos candidatures</p>
          </div>

          {applications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-2">Aucune candidature</h3>
                <p className="text-gray-600">Vous n'avez pas encore postulé à des offres.</p>
                <Button 
                  onClick={() => setActiveTab('offers')}
                  className="mt-4"
                  variant="outline"
                >
                  Découvrir les offres
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{application.offerTitle}</h4>
                        <p className="text-gray-600">{application.company}</p>
                        <p className="text-sm text-gray-500">Postulé le {application.appliedDate}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentView;
