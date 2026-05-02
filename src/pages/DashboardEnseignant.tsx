import { useState } from "react";
import {
  Search,
  FileText,
  Newspaper,
  MapPin,
  Clock,
  Tag,
  Briefcase,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import DashboardLayout from "../components/DashboardLayout";
import ActualitesPanel from "../components/ActualitesPanel";
import CVUploader from "../components/CVUploader";
import ProfileEditor from "../components/ProfileEditor";
import { useOffreStore } from "../stores/offreStore";

interface Offre {
  id: number;
  titre: string;
  ecoleNom: string;
  matiere: string;
  niveau: string;
  ville: string;
  type: string;
  dateDebut: string;
  tarif: string;
  description: string;
  candidatures: number;
}

const mockOffres = [
  {
    id: 1,
    titre: "Professeur de Mathématiques",
    ecoleNom: "Lycée Victor Hugo",
    matiere: "Mathématiques",
    niveau: "Terminale",
    ville: "Paris",
    type: "CDD - 6 mois",
    dateDebut: "2026-02-01",
    tarif: "45 Cfa/h",
    description:
      "Nous recherchons un professeur de mathématiques pour des classes de Terminale S.",
    candidatures: 2,
  },
  {
    id: 2,
    titre: "Enseignant Physique-Chimie",
    ecoleNom: "Collège Jean Moulin",
    matiere: "Physique-Chimie",
    niveau: "3ème",
    ville: "Lyon",
    type: "Vacation",
    dateDebut: "2026-02-15",
    tarif: "40 Cfa/h",
    description: "Remplacement pour congé maternité, classes de 3ème.",
    candidatures: 0,
  },
  {
    id: 3,
    titre: "Prof de Français",
    ecoleNom: "Lycée Pasteur",
    matiere: "Français",
    niveau: "Seconde",
    ville: "Marseille",
    type: "CDD - 3 mois",
    dateDebut: "2026-03-01",
    tarif: "42 Cfa/h",
    description: "Enseignement du français pour classes de Seconde générale.",
    candidatures: 1,
  },
];

const mockActualites = [
  {
    id: 1,
    titre: "Nouvelle fonctionnalité: Chat en temps réel",
    date: "2026-01-20",
    type: "info",
  },
  {
    id: 2,
    titre: "Webinaire: Comment optimiser son profil",
    date: "2026-01-18",
    type: "event",
  },
  {
    id: 3,
    titre: "Rappel: Mise à jour de votre CV",
    date: "2026-01-15",
    type: "reminder",
  },
];

export default function DashboardEnseignant() {
  const { user } = useAuthStore();
  const { offres, addCandidature } = useOffreStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [disponible, setDisponible] = useState(
    user?.profile?.disponible ?? true,
  );
  const [selectedOffre, setSelectedOffre] = useState<any>(null);
  const [showCVUploader, setShowCVUploader] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showActualites, setShowActualites] = useState(false);

  const filteredOffres = offres.filter(
    (offre) =>
      offre.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.ecoleNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.matiere.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePostuler = (offre: any) => {
    if (user) {
      addCandidature({
        offreId: offre.id,
        enseignantId: user.id,
        enseignantNom: user.name,
        enseignantEmail: user.email,
        motivation: "Candidature spontanée", // TODO: Add motivation form
        statut: "en_attente",
      });
      alert("Votre candidature a été envoyée avec succès!");
      setSelectedOffre(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Section */}
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
                  <Briefcase className="w-4 h-4" />
                  {user?.profile?.matiere || "Matière"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {user?.profile?.experience || "Expérience"}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {user?.profile?.tarif || "Tarif"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowProfileEditor(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Modifier le profil"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDisponible(!disponible)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  disponible
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
              >
                {disponible ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Disponible
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Indisponible
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par école, poste ou matière..."
                className="input"
                style={{ paddingLeft: "2.5rem" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCVUploader(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Mon CV
              </button>
              <button
                onClick={() => setShowActualites(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Newspaper className="w-5 h-5" />
                Actualités
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Offres disponibles */}
          <div className="lg:col-span-2 space-y-4">
            <h3>Offres disponibles ({filteredOffres.length})</h3>
            {filteredOffres.map((offre) => (
              <div
                key={offre.id}
                className="card hover:shadow-lg cursor-pointer transition-all"
                onClick={() => setSelectedOffre(offre)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="mb-1">{offre.titre}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {offre.ecoleNom}
                    </p>
                  </div>
                  <span className="badge badge-primary">{offre.matiere}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {offre.description}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {offre.ville}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {offre.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {offre.tarif}
                  </span>
                </div>
                {offre.candidatures && offre.candidatures > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {offre.candidatures} candidature
                    {offre.candidatures > 1 ? "s" : ""}
                  </div>
                )}
                <button
                  className="btn-primary w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePostuler(offre);
                  }}
                >
                  Postuler
                </button>
              </div>
            ))}
            {filteredOffres.length === 0 && (
              <div className="card text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h4 className="mb-2">Aucune offre trouvée</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>

          {/* Actualités */}
          <div className="space-y-4">
            <h3>Actualités</h3>
            <ActualitesPanel />
          </div>
        </div>
      </div>

      {/* Modal Offre Detail */}
      {selectedOffre && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOffre(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2>{selectedOffre.titre}</h2>
              <button
                onClick={() => setSelectedOffre(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">École</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedOffre.ecoleNom}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Matière</h4>
                  <span className="badge badge-primary">
                    {selectedOffre.matiere}
                  </span>
                </div>
                <div>
                  <h4 className="mb-2">Niveau</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedOffre.niveau}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Type de contrat</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedOffre.type}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">Tarif</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedOffre.tarif}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedOffre.description}
                </p>
              </div>
              <button
                className="btn-primary w-full"
                onClick={() => handlePostuler(selectedOffre)}
              >
                Postuler à cette offre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCVUploader && (
        <CVUploader onClose={() => setShowCVUploader(false)} />
      )}
      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
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