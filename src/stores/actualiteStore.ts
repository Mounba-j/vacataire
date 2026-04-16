import { create } from 'zustand';

export interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  type: 'info' | 'event' | 'reminder' | 'update';
  visiblePour: ('admin' | 'enseignant' | 'ecole' | 'parent')[];
  datePublication: string;
  auteurNom: string;
  vues: number;
  image?: string;
}

interface ActualiteState {
  actualites: Actualite[];
  addActualite: (actualite: Omit<Actualite, 'id' | 'datePublication' | 'vues'>) => void;
  updateActualite: (id: number, actualite: Partial<Actualite>) => void;
  deleteActualite: (id: number) => void;
  incrementVues: (id: number) => void;
  getActualitesByRole: (role: string) => Actualite[];
}

const mockActualites: Actualite[] = [
  {
    id: 1,
    titre: 'Nouvelle fonctionnalité: Chat en temps réel',
    contenu: 'Nous sommes ravis d\'annoncer le lancement de notre nouvelle fonctionnalité de chat en temps réel. Vous pouvez désormais communiquer instantanément avec les écoles et les enseignants.',
    type: 'update',
    visiblePour: ['admin', 'enseignant', 'ecole', 'parent'],
    datePublication: '2026-01-20',
    auteurNom: 'Équipe Vacataire',
    vues: 245,
  },
  {
    id: 2,
    titre: 'Webinaire: Comment optimiser son profil',
    contenu: 'Rejoignez-nous le 5 février pour un webinaire gratuit sur l\'optimisation de votre profil enseignant. Apprenez les meilleures pratiques pour attirer plus d\'opportunités.',
    type: 'event',
    visiblePour: ['enseignant'],
    datePublication: '2026-01-18',
    auteurNom: 'Sophie Martin',
    vues: 123,
  },
  {
    id: 3,
    titre: 'Rappel: Mise à jour de votre CV',
    contenu: 'N\'oubliez pas de maintenir votre CV à jour pour maximiser vos chances d\'être contacté par les établissements.',
    type: 'reminder',
    visiblePour: ['enseignant'],
    datePublication: '2026-01-15',
    auteurNom: 'Système',
    vues: 89,
  },
  {
    id: 4,
    titre: 'Nouveaux établissements partenaires',
    contenu: '15 nouveaux établissements ont rejoint la plateforme ce mois-ci. Plus d\'opportunités pour nos enseignants!',
    type: 'info',
    visiblePour: ['admin', 'enseignant'],
    datePublication: '2026-01-12',
    auteurNom: 'Équipe Vacataire',
    vues: 178,
  },
  {
    id: 5,
    titre: 'Guide: Publier une offre efficace',
    contenu: 'Découvrez notre nouveau guide pour créer des offres d\'emploi attractives et trouver rapidement les meilleurs candidats.',
    type: 'info',
    visiblePour: ['ecole'],
    datePublication: '2026-01-10',
    auteurNom: 'Jean Dubois',
    vues: 67,
  },
  {
    id: 6,
    titre: 'Comment choisir le bon enseignant',
    contenu: 'Conseils pratiques pour les parents: comment évaluer et choisir l\'enseignant idéal pour votre enfant.',
    type: 'info',
    visiblePour: ['parent'],
    datePublication: '2026-01-08',
    auteurNom: 'Marie Dupont',
    vues: 156,
  },
];

export const useActualiteStore = create<ActualiteState>((set, get) => ({
  actualites: mockActualites,

  addActualite: (actualite) => {
    const newActualite: Actualite = {
      ...actualite,
      id: Math.max(0, ...get().actualites.map(a => a.id)) + 1,
      datePublication: new Date().toISOString().split('T')[0],
      vues: 0,
    };
    set((state) => ({ actualites: [newActualite, ...state.actualites] }));
  },

  updateActualite: (id, actualite) => {
    set((state) => ({
      actualites: state.actualites.map((a) => (a.id === id ? { ...a, ...actualite } : a)),
    }));
  },

  deleteActualite: (id) => {
    set((state) => ({
      actualites: state.actualites.filter((a) => a.id !== id),
    }));
  },

  incrementVues: (id) => {
    set((state) => ({
      actualites: state.actualites.map((a) =>
        a.id === id ? { ...a, vues: a.vues + 1 } : a
      ),
    }));
  },

  getActualitesByRole: (role) => {
    return get().actualites.filter((a) =>
      a.visiblePour.includes(role as any)
    ).sort((a, b) => 
      new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime()
    );
  },
}));
