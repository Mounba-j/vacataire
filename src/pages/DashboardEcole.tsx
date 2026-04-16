import { useState } from 'react';
import { Search, Plus, Newspaper, MapPin, BookOpen, Users, CheckCircle, XCircle, Eye, Trash2, Edit3, Briefcase, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import DashboardLayout from '../components/DashboardLayout';
import OffreForm from '../components/OffreForm';
import CandidaturesList from '../components/CandidaturesList';
import ActualitesPanel from '../components/ActualitesPanel';
import CVViewer from '../components/CVViewer';
import ContactEnseignantModal from '../components/ContactEnseignantModal';
import { useOffreStore } from '../stores/offreStore';
import { useCVStore } from '../stores/cvStore';

interface Enseignant {
  id: number;
  nom: string;
  matiere: string;
  experience: string;
  ville: string;
  disponible: boolean;
  tarif: string;
  avatar: string;
  email: string;
  telephone: string;
}

const mockEnseignants: Enseignant[] = [
  {
    id: 1,
    nom: 'Marie Dupont',
    matiere: 'Mathématiques',
    experience: '5 ans',
    ville: 'Paris',
    disponible: true,
    tarif: '45 €/h',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    email: 'marie.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
  },
  {
    id: 2,
    nom: 'Pierre Martin',
    matiere: 'Physique-Chimie',
    experience: '8 ans',
    ville: 'Paris',
    disponible: true,
    tarif: '50 €/h',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pierre',
    email: 'pierre.martin@email.com',
    telephone: '+33 6 23 45 67 89',
  },
  {
    id: 3,
    nom: 'Sophie Bernard',
    matiere: 'Français',
    experience: '3 ans',
    ville: 'Paris',
    disponible: false,
    tarif: '42 €/h',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
    email: 'sophie.bernard@email.com',
    telephone: '+33 6 34 56 78 90',
  },
  {
    id: 4,
    nom: 'Jean Dubois',
    matiere: 'Anglais',
    experience: '6 ans',
    ville: 'Paris',
    disponible: true,
    tarif: '48 €/h',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jean',
    email: 'jean.dubois@email.com',
    telephone: '+33 6 45 67 89 01',
  },
];

const matieres = ['Toutes', 'Mathématiques', 'Physique-Chimie', 'Français', 'Anglais', 'Histoire-Géographie'];

export default function DashboardEcole() {
  const { user } = useAuthStore();
  const { offres, deleteOffre } = useOffreStore();
  const { getCVByEnseignant } = useCVStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('Toutes');
  const [enBesoin, setEnBesoin] = useState(user?.profile?.enBesoin ?? true);
  const [showOffreForm, setShowOffreForm] = useState(false);
  const [editingOffre, setEditingOffre] = useState<any>(null);
  const [showCandidatures, setShowCandidatures] = useState<{ offreId: number; titre: string } | null>(null);
  const [showActualites, setShowActualites] = useState(false);
  const [activeTab, setActiveTab] = useState<'enseignants' | 'offres'>('enseignants');
  const [showCVViewer, setShowCVViewer] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState<Enseignant | null>(null);

  // Get school's offres
  const mesOffres = user ? offres.filter(o => o.ecoleId === user.id) : [];

  const filteredEnseignants = mockEnseignants.filter((ens) => {
    const matchesSearch = ens.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMatiere = selectedMatiere === 'Toutes' || ens.matiere === selectedMatiere;
    return matchesSearch && matchesMatiere;
  });

  const handleDeleteOffre = (offreId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      deleteOffre(offreId);
    }
  };

  const handleViewCV = (enseignantId: number) => {
    setShowCVViewer(enseignantId);
  };

  const handleContactEnseignant = (enseignant: Enseignant) => {
    setShowContactModal(enseignant);
  };

  const cvToView = showCVViewer ? getCVByEnseignant(showCVViewer) : null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* École Profile */}
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-4 border-blue-100 dark:border-blue-900"
            />
            <div className="flex-1">
              <h2 className="mb-1">{user?.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user?.profile?.adresse || 'Adresse'}, {user?.profile?.ville || 'Ville'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEnBesoin(!enBesoin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                enBesoin
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}
            >
              {enBesoin ? (
                <>
                  <Users className="w-5 h-5" />
                  En besoin
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Chercher un enseignant par nom..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingOffre(null);
                  setShowOffreForm(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Publier une offre
              </button>
              <button 
                onClick={() => setShowActualites(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Newspaper className="w-5 h-5" />
                Actualités
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('enseignants')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'enseignants'
                  ? 'bg-[#E63946] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              Enseignants disponibles
            </button>
            <button
              onClick={() => setActiveTab('offres')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'offres'
                  ? 'bg-[#E63946] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              Mes offres ({mesOffres.length})
            </button>
          </div>
        </div>

        {activeTab === 'enseignants' && (
          <>
            {/* Filtres par matière */}
            <div className="card">
              <h3 className="mb-4">Enseignants par matière</h3>
              <div className="flex flex-wrap gap-2">
                {matieres.map((matiere) => (
                  <button
                    key={matiere}
                    onClick={() => setSelectedMatiere(matiere)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedMatiere === matiere
                        ? 'bg-[#E63946] text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {matiere}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste des enseignants */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEnseignants.map((ens) => (
                <div
                  key={ens.id}
                  className="card hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={ens.avatar}
                      alt={ens.nom}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 truncate">{ens.nom}</h4>
                      <span className="badge badge-primary text-xs">{ens.matiere}</span>
                    </div>
                    {ens.disponible ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{ens.experience} d'expérience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{ens.ville}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#E63946]">{ens.tarif}</span>
                      <span className={`text-xs ${ens.disponible ? 'text-green-600' : 'text-red-600'}`}>
                        {ens.disponible ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewCV(ens.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Voir le CV
                    </button>
                    <button 
                      onClick={() => handleContactEnseignant(ens)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'offres' && (
          <div className="space-y-4">
            {mesOffres.length === 0 ? (
              <div className="card text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h4 className="mb-2">Aucune offre publiée</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Commencez par publier votre première offre d'emploi
                </p>
                <button
                  onClick={() => {
                    setEditingOffre(null);
                    setShowOffreForm(true);
                  }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Publier une offre
                </button>
              </div>
            ) : (
              mesOffres.map((offre) => (
                <div key={offre.id} className="card hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4>{offre.titre}</h4>
                        <span className="badge badge-primary">{offre.matiere}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {offre.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {offre.ville}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {offre.type}
                        </span>
                        <span className="flex items-center gap-1">
                          {offre.tarif}
                        </span>
                      </div>
                      {offre.candidatures && offre.candidatures > 0 && (
                        <button
                          onClick={() => setShowCandidatures({ offreId: offre.id, titre: offre.titre })}
                          className="flex items-center gap-2 text-sm font-medium text-[#E63946] hover:underline"
                        >
                          <Users className="w-4 h-4" />
                          {offre.candidatures} candidature{offre.candidatures > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowCandidatures({ offreId: offre.id, titre: offre.titre })}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Voir les candidatures
                    </button>
                    <button
                      onClick={() => {
                        setEditingOffre(offre);
                        setShowOffreForm(true);
                      }}
                      title="Modifier l'offre"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOffre(offre.id)}
                      title="Supprimer l'offre"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showOffreForm && (
        <OffreForm
          onClose={() => {
            setShowOffreForm(false);
            setEditingOffre(null);
          }}
          editOffre={editingOffre}
        />
      )}

      {showCandidatures && (
        <CandidaturesList
          offreId={showCandidatures.offreId}
          offreTitre={showCandidatures.titre}
          onClose={() => setShowCandidatures(null)}
        />
      )}

      {/* CV Viewer Modal */}
      {cvToView && (
        <CVViewer
          cv={cvToView}
          onClose={() => setShowCVViewer(null)}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactEnseignantModal
          enseignant={{
            id: showContactModal.id,
            nom: showContactModal.nom,
            email: showContactModal.email,
            avatar: showContactModal.avatar,
            matiere: showContactModal.matiere,
          }}
          onClose={() => setShowContactModal(null)}
        />
      )}

      {/* Actualités Modal */}
      {showActualites && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowActualites(false)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2>Actualités</h2>
              <button
                onClick={() => setShowActualites(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <ActualitesPanel />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}