import { create } from 'zustand';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'enseignant' | 'ecole' | 'parent';
  avatar?: string;
  profile?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  updateUserAvatar: (avatar: string) => void;
  updateUserProfile: (profile: Partial<User>) => void;
}

// Mock users for development
const mockUsers = [
  {
    id: 1,
    email: 'admin@vacataire.local',
    password: 'password123',
    name: 'Admin Principal',
    role: 'admin' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 2,
    email: 'enseignant1@vacataire.local',
    password: 'password123',
    name: 'Marie Dupont',
    role: 'enseignant' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    profile: {
      matiere: 'Mathématiques',
      experience: '5 ans',
      disponible: true,
      tarif: '45 €/h',
    },
  },
  {
    id: 3,
    email: 'ecole1@vacataire.local',
    password: 'password123',
    name: 'Lycée Victor Hugo',
    role: 'ecole' as const,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=victor',
    profile: {
      adresse: '15 rue de la République',
      ville: 'Paris',
      enBesoin: true,
    },
  },
  {
    id: 4,
    email: 'parent1@vacataire.local',
    password: 'password123',
    name: 'Sophie Martin',
    role: 'parent' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
    profile: {
      ville: 'Lyon',
      telephone: '+33 6 98 76 54 32',
    },
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initializeAuth: () => {
    const token = localStorage.getItem('vacataire_token');
    const userStr = localStorage.getItem('vacataire_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('vacataire_token');
        localStorage.removeItem('vacataire_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile,
    };

    localStorage.setItem('vacataire_token', token);
    localStorage.setItem('vacataire_user', JSON.stringify(userData));

    set({
      user: userData,
      token,
      isAuthenticated: true,
    });
  },

  register: async (data: any) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser = {
      id: mockUsers.length + 1,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      profile: data.profile || {},
    };

    const token = `mock_token_${newUser.id}_${Date.now()}`;

    localStorage.setItem('vacataire_token', token);
    localStorage.setItem('vacataire_user', JSON.stringify(newUser));

    set({
      user: newUser,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('vacataire_token');
    localStorage.removeItem('vacataire_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUserAvatar: (avatar: string) => {
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, avatar };
      localStorage.setItem('vacataire_user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    });
  },

  updateUserProfile: (profile: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, ...profile };
      localStorage.setItem('vacataire_user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    });
  },
}));