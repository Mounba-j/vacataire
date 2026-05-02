import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';

const normalizeTarif = (tarif: string): string => tarif.replace(/€/g, "XOF");

export interface Offre {
  id: number;
  titre: string;
  ecoleId: number;
  ecoleNom: string;
  matiere: string;
  niveau: string;
  ville: string;
  type: string;
  dateDebut: string;
  dateFin?: string;
  tarif: string;
  description: string;
  statut: 'active' | 'pourvue' | 'expiree';
  createdAt: string;
  candidatures?: number;
}

export interface Candidature {
  id: number;
  offreId: number;
  enseignantId: number;
  enseignantNom: string;
  enseignantEmail: string;
  motivation: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  datePostulation: string;
}

interface OffreState {
  offres: Offre[];
  candidatures: Candidature[];
  addOffre: (offre: Omit<Offre, 'id' | 'createdAt' | 'candidatures'>) => void;
  updateOffre: (id: number, offre: Partial<Offre>) => void;
  deleteOffre: (id: number) => void;
  addCandidature: (candidature: Omit<Candidature, 'id' | 'datePostulation'>) => void;
  updateCandidature: (id: number, statut: Candidature['statut']) => void;
  getOffresByEcole: (ecoleId: number) => Offre[];
  getCandidaturesByOffre: (offreId: number) => Candidature[];
  getCandidaturesByEnseignant: (enseignantId: number) => Candidature[];
}

// Mock data
const mockOffres: Offre[] = [
  {
    id: 1,
    titre: "Professeur de Mathématiques",
    ecoleId: 3,
    ecoleNom: "Lycée Victor Hugo",
    matiere: "Mathématiques",
    niveau: "Terminale",
    ville: "Paris",
    type: "CDD - 6 mois",
    dateDebut: "2026-02-01",
    tarif: "45 Cfa/h",
    description:
      "Nous recherchons un professeur de mathématiques pour des classes de Terminale S. Expérience requise dans la préparation au baccalauréat.",
    statut: "active",
    createdAt: "2026-01-15",
    candidatures: 5,
  },
  {
    id: 2,
    titre: "Enseignant Physique-Chimie",
    ecoleId: 3,
    ecoleNom: "Collège Jean Moulin",
    matiere: "Physique-Chimie",
    niveau: "3ème",
    ville: "Lyon",
    type: "Vacation",
    dateDebut: "2026-02-15",
    dateFin: "2026-06-30",
    tarif: "40 Cfa/h",
    description:
      "Remplacement pour congé maternité, classes de 3ème. Début immédiat souhaité.",
    statut: "active",
    createdAt: "2026-01-18",
    candidatures: 3,
  },
  {
    id: 3,
    titre: "Prof de Français",
    ecoleId: 3,
    ecoleNom: "Lycée Pasteur",
    matiere: "Français",
    niveau: "Seconde",
    ville: "Marseille",
    type: "CDD - 3 mois",
    dateDebut: "2026-03-01",
    tarif: "42 Cfa/h",
    description:
      "Enseignement du français pour classes de Seconde générale. Préparation aux épreuves anticipées.",
    statut: "active",
    createdAt: "2026-01-20",
    candidatures: 7,
  },
];

const mockCandidatures: Candidature[] = [
  {
    id: 1,
    offreId: 1,
    enseignantId: 2,
    enseignantNom: 'Marie Dupont',
    enseignantEmail: 'marie.dupont@email.com',
    motivation: 'Passionnée par les mathématiques avec 5 ans d\'expérience en Terminale.',
    statut: 'en_attente',
    datePostulation: '2026-01-16',
  },
  {
    id: 2,
    offreId: 1,
    enseignantId: 5,
    enseignantNom: 'Thomas Petit',
    enseignantEmail: 'thomas.petit@email.com',
    motivation: 'Spécialiste en préparation au bac, excellent taux de réussite.',
    statut: 'en_attente',
    datePostulation: '2026-01-17',
  },
];

export const useOffreStore = create<OffreState>((set, get) => ({
  offres: mockOffres,
  candidatures: mockCandidatures,

  addOffre: (offre) => {
    const newOffre: Offre = {
      ...offre,
      tarif: normalizeTarif(offre.tarif),
      id: Math.max(0, ...get().offres.map((o) => o.id)) + 1,
      createdAt: new Date().toISOString().split("T")[0],
      candidatures: 0,
    };
    set((state) => ({ offres: [...state.offres, newOffre] }));
  },

  updateOffre: (id, offre) => {
    const updatedOffre = offre.tarif
      ? { ...offre, tarif: normalizeTarif(offre.tarif) }
      : offre;

    set((state) => ({
      offres: state.offres.map((o) =>
        o.id === id ? { ...o, ...updatedOffre } : o,
      ),
    }));
  },

  deleteOffre: (id) => {
    set((state) => ({
      offres: state.offres.filter((o) => o.id !== id),
      candidatures: state.candidatures.filter((c) => c.offreId !== id),
    }));
  },

  addCandidature: (candidature) => {
    const newCandidature: Candidature = {
      ...candidature,
      id: Math.max(0, ...get().candidatures.map(c => c.id)) + 1,
      datePostulation: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ candidatures: [...state.candidatures, newCandidature] }));
    
    // Update offre candidatures count
    const offre = get().offres.find(o => o.id === candidature.offreId);
    if (offre) {
      get().updateOffre(offre.id, { candidatures: (offre.candidatures || 0) + 1 });
      
      // Notify the school about the new candidature
      useNotificationStore.getState().notifyNewCandidature(
        offre.ecoleId,
        candidature.enseignantNom,
        offre.id
      );
    }
  },

  updateCandidature: (id, statut) => {
    set((state) => ({
      candidatures: state.candidatures.map((c) =>
        c.id === id ? { ...c, statut } : c
      ),
    }));
  },

  getOffresByEcole: (ecoleId) => {
    return get().offres.filter((o) => o.ecoleId === ecoleId);
  },

  getCandidaturesByOffre: (offreId) => {
    return get().candidatures.filter((c) => c.offreId === offreId);
  },

  getCandidaturesByEnseignant: (enseignantId) => {
    return get().candidatures.filter((c) => c.enseignantId === enseignantId);
  },
}));