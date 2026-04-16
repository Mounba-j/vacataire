import { create } from 'zustand';

export interface UserManagement {
  id: number;
  nom: string;
  email: string;
  role: 'enseignant' | 'ecole' | 'parent';
  avatar: string;
  statut: 'actif' | 'suspendu';
  dateInscription: string;
  derniereConnexion: string;
}

interface AdminState {
  users: UserManagement[];
  suspendreUser: (userId: number) => void;
  reactiverUser: (userId: number) => void;
  getUsersByRole: (role: string) => UserManagement[];
}

const mockUsers: UserManagement[] = [
  {
    id: 2,
    nom: 'Marie Dupont',
    email: 'enseignant1@vacataire.local',
    role: 'enseignant',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    statut: 'actif',
    dateInscription: '2025-12-10',
    derniereConnexion: '2026-01-30',
  },
  {
    id: 3,
    nom: 'Lycée Victor Hugo',
    email: 'ecole1@vacataire.local',
    role: 'ecole',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=victor',
    statut: 'actif',
    dateInscription: '2025-11-20',
    derniereConnexion: '2026-01-29',
  },
  {
    id: 4,
    nom: 'Sophie Martin',
    email: 'parent1@vacataire.local',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
    statut: 'actif',
    dateInscription: '2026-01-05',
    derniereConnexion: '2026-01-28',
  },
  {
    id: 5,
    nom: 'Thomas Petit',
    email: 'thomas.petit@email.com',
    role: 'enseignant',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
    statut: 'suspendu',
    dateInscription: '2025-10-15',
    derniereConnexion: '2026-01-20',
  },
];

export const useAdminStore = create<AdminState>((set, get) => ({
  users: mockUsers,

  suspendreUser: (userId) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, statut: 'suspendu' as const } : u
      ),
    }));
  },

  reactiverUser: (userId) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, statut: 'actif' as const } : u
      ),
    }));
  },

  getUsersByRole: (role) => {
    if (role === 'tous') return get().users;
    return get().users.filter((u) => u.role === role);
  },
}));
