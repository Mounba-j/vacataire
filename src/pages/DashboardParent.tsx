import { useState } from "react";
import {
  Search,
  Newspaper,
  MapPin,
  BookOpen,
  Clock,
  Mail,
  Phone,
  Star,
  FileText,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import DashboardLayout from "../components/DashboardLayout";
import CVViewer from "../components/CVViewer";
import ContactEnseignantModal from "../components/ContactEnseignantModal";
import { useCVStore } from "../stores/cvStore";
import { useActualiteStore } from "../stores/actualiteStore";

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
  rating: number;
  niveaux: string[];
  bio: string;
}

const mockEnseignants: Enseignant[] = [
  {
    id: 1,
    nom: "Marie Dupont",
    matiere: "Mathématiques",
    experience: "5 ans",
    ville: "Paris",
    disponible: true,
    tarif: "45 Cfa/h",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie",
    email: "marie.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    rating: 4.8,
    niveaux: ["Collège", "Lycée"],
    bio: "Professeure de mathématiques passionnée avec 5 ans d'expérience. Spécialisée dans la préparation au bac.",
  },
  {
    id: 2,
    nom: "Pierre Martin",
    matiere: "Physique-Chimie",
    experience: "8 ans",
    ville: "Lyon",
    disponible: true,
    tarif: "50 Cfa/h",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pierre",
    email: "pierre.martin@email.com",
    telephone: "+33 6 23 45 67 89",
    rating: 4.9,
    niveaux: ["Lycée"],
    bio: "Enseignant expérimenté en physique-chimie. Méthode pédagogique adaptée à chaque élève.",
  },
  {
    id: 3,
    nom: "Sophie Bernard",
    matiere: "Français",
    experience: "3 ans",
    ville: "Marseille",
    disponible: true,
    tarif: "42 Cfa/h",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie",
    email: "sophie.bernard@email.com",
    telephone: "+33 6 34 56 78 90",
    rating: 4.7,
    niveaux: ["Collège", "Lycée"],
    bio: "Professeure de français dynamique. Aide aux devoirs et préparation au brevet.",
  },
  {
    id: 4,
    nom: "Jean Dubois",
    matiere: "Anglais",
    experience: "6 ans",
    ville: "Paris",
    disponible: true,
    tarif: "48 Cfa/h",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jean",
    email: "jean.dubois@email.com",
    telephone: "+33 6 45 67 89 01",
    rating: 4.6,
    niveaux: ["Collège", "Lycée"],
    bio: "Professeur d'anglais bilingue. Préparation TOEFL et cours de conversation.",
  },
  {
    id: 5,
    nom: "Claire Rousseau",
    matiere: "Histoire-Géographie",
    experience: "4 ans",
    ville: "Lyon",
    disponible: true,
    tarif: "43 Cfa/h",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=claire",
    email: "claire.rousseau@email.com",
    telephone: "+33 6 56 78 90 12",
    rating: 4.5,
    niveaux: ["Collège", "Lycée"],
    bio: "Enseignante passionnée d'histoire et de géographie. Cours vivants et interactifs.",
  },
  {
    id: 6,
    nom: "Thomas Petit",
    matiere: "Mathématiques",
    experience: "7 ans",
    ville: "Marseille",
    disponible: true,
    tarif: "47 Cfa/h",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
    email: "thomas.petit@email.com",
    telephone: "+33 6 67 89 01 23",
    rating: 4.9,
    niveaux: ["Lycée"],
    bio: "Professeur de mathématiques spécialisé dans les classes préparatoires.",
  },
];

const matieres = [
  "Toutes",
  "Mathématiques",
  "Physique-Chimie",
  "Français",
  "Anglais",
  "Histoire-Géographie",
];

export default function DashboardParent() {
  const { user } = useAuthStore();
  const { getActualitesByRole, incrementVues } = useActualiteStore();
  const { getCVByEnseignant } = useCVStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("Toutes");
  const [selectedEnseignant, setSelectedEnseignant] =
    useState<Enseignant | null>(null);
  const [showCVViewer, setShowCVViewer] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState<Enseignant | null>(
    null,
  );

  const filteredEnseignants = mockEnseignants
    .filter((ens) => {
      const matchesSearch =
        ens.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ens.matiere.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ens.ville.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMatiere =
        selectedMatiere === "Toutes" || ens.matiere === selectedMatiere;
      return matchesSearch && matchesMatiere;
    })
    .sort((a, b) => {
      // Sort by experience (descending) then by rating (descending)
      const expA = parseInt(a.experience);
      const expB = parseInt(b.experience);
      if (expB !== expA) return expB - expA;
      return b.rating - a.rating;
    });

  const handleViewCV = (enseignantId: number) => {
    setShowCVViewer(enseignantId);
    setSelectedEnseignant(null);
  };

  const handleContactEnseignant = (enseignant: Enseignant) => {
    setShowContactModal(enseignant);
    setSelectedEnseignant(null);
  };

  const cvToView = showCVViewer ? getCVByEnseignant(showCVViewer) : null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className="card">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900"
            />
            <div className="flex-1">
              <h2 className="mb-1">{user?.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user?.profile?.ville || "Ville"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {user?.profile?.telephone || "Téléphone"}
                </span>
              </div>
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
                placeholder="Chercher par nom, matière ou ville..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Actualités
            </button>
          </div>
        </div>

        {/* Filtres par matière */}
        <div className="card">
          <h3 className="mb-4">Filtrer par matière</h3>
          <div className="flex flex-wrap gap-2">
            {matieres.map((matiere) => (
              <button
                key={matiere}
                onClick={() => setSelectedMatiere(matiere)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedMatiere === matiere
                    ? "bg-[#E63946] text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                {matiere}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des enseignants */}
        <div>
          <h3 className="mb-4">
            Enseignants disponibles ({filteredEnseignants.length})
          </h3>
          <div className="space-y-4">
            {filteredEnseignants.map((ens) => (
              <div key={ens.id} className="card hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={ens.avatar}
                    alt={ens.nom}
                    className="w-24 h-24 rounded-full mx-auto md:mx-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="mb-1">{ens.nom}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge badge-primary">
                            {ens.matiere}
                          </span>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{ens.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold text-[#E63946] mb-1">
                          {ens.tarif}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          par heure
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {ens.bio}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {ens.experience} d'expérience
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ens.ville}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {ens.niveaux.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => handleViewCV(ens.id)}
                      className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Voir le CV
                    </button>
                    <button
                      onClick={() => handleContactEnseignant(ens)}
                      className="btn-primary flex-1 md:flex-none"
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CV Viewer Modal */}
      {cvToView && (
        <CVViewer cv={cvToView} onClose={() => setShowCVViewer(null)} />
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

      {/* Modal Détail Enseignant - Removed, using CV Viewer instead */}
    </DashboardLayout>
  );
}
