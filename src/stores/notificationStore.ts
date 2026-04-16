import { create } from 'zustand';

export type NotificationType = 
  | 'message' 
  | 'offre' 
  | 'candidature' 
  | 'forum' 
  | 'cv' 
  | 'actualite' 
  | 'admin'
  | 'system';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  titre: string;
  contenu: string;
  lue: boolean;
  dateCreation: string;
  lien?: string;
  metadata?: {
    expediteurId?: number;
    expediteurNom?: string;
    offreId?: number;
    candidatureId?: number;
    forumPostId?: number;
  };
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'dateCreation' | 'lue'>) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (userId: number) => void;
  deleteNotification: (notificationId: number) => void;
  getNotificationsByUser: (userId: number) => Notification[];
  getUnreadCount: (userId: number) => number;
  clearAllNotifications: (userId: number) => void;
  notifyNewMessage: (userId: number, expediteurId: number, expediteurNom: string) => void;
  notifyNewOffre: (userId: number, titre: string, offreId: number) => void;
  notifyNewCandidature: (userId: number, candidatNom: string, offreId: number) => void;
  notifyForumReply: (userId: number, postId: number, auteurNom: string) => void;
  notifyNewActualite: (userId: number, titre: string) => void;
}

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 2,
    type: 'message',
    titre: 'Nouveau message',
    contenu: 'Lycée Victor Hugo vous a envoyé un message',
    lue: false,
    dateCreation: '2026-03-31T10:30:00',
    lien: '/messages',
    metadata: {
      expediteurId: 3,
      expediteurNom: 'Lycée Victor Hugo',
    },
  },
  {
    id: 2,
    userId: 2,
    type: 'offre',
    titre: 'Nouvelle offre',
    contenu: 'Une nouvelle offre correspond à votre profil: Professeur de Mathématiques',
    lue: false,
    dateCreation: '2026-03-31T09:15:00',
    lien: '/dashboard/enseignant',
    metadata: {
      offreId: 1,
    },
  },
  {
    id: 3,
    userId: 3,
    type: 'candidature',
    titre: 'Nouvelle candidature',
    contenu: 'Marie Dupont a postulé à votre offre',
    lue: true,
    dateCreation: '2026-03-30T16:20:00',
    lien: '/dashboard/ecole',
    metadata: {
      expediteurId: 2,
      expediteurNom: 'Marie Dupont',
      offreId: 1,
    },
  },
  {
    id: 4,
    userId: 2,
    type: 'forum',
    titre: 'Réponse au forum',
    contenu: 'Jean Dubois a répondu à votre post',
    lue: true,
    dateCreation: '2026-03-30T14:45:00',
    lien: '/forum',
    metadata: {
      forumPostId: 1,
      expediteurNom: 'Jean Dubois',
    },
  },
  {
    id: 5,
    userId: 4,
    type: 'actualite',
    titre: 'Nouvelle actualité',
    contenu: 'Découvrez les nouveautés de la plateforme',
    lue: false,
    dateCreation: '2026-03-31T08:00:00',
    lien: '/dashboard/parent',
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.max(0, ...get().notifications.map(n => n.id)) + 1,
      dateCreation: new Date().toISOString(),
      lue: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, lue: true } : n
      ),
    }));
  },

  markAllAsRead: (userId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.userId === userId ? { ...n, lue: true } : n
      ),
    }));
  },

  deleteNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    }));
  },

  getNotificationsByUser: (userId) => {
    return get()
      .notifications.filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  },

  getUnreadCount: (userId) => {
    return get().notifications.filter((n) => n.userId === userId && !n.lue).length;
  },

  clearAllNotifications: (userId) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.userId !== userId),
    }));
  },

  // Helper functions for common notification scenarios
  notifyNewMessage: (userId, expediteurId, expediteurNom) => {
    get().addNotification({
      userId,
      type: 'message',
      titre: 'Nouveau message',
      contenu: `${expediteurNom} vous a envoyé un message`,
      lien: '/messages',
      metadata: {
        expediteurId,
        expediteurNom,
      },
    });
  },

  notifyNewOffre: (userId, titre, offreId) => {
    get().addNotification({
      userId,
      type: 'offre',
      titre: 'Nouvelle offre',
      contenu: `Une nouvelle offre correspond à votre profil: ${titre}`,
      lien: '/dashboard/enseignant',
      metadata: {
        offreId,
      },
    });
  },

  notifyNewCandidature: (userId, candidatNom, offreId) => {
    get().addNotification({
      userId,
      type: 'candidature',
      titre: 'Nouvelle candidature',
      contenu: `${candidatNom} a postulé à votre offre`,
      lien: '/dashboard/ecole',
      metadata: {
        expediteurNom: candidatNom,
        offreId,
      },
    });
  },

  notifyForumReply: (userId, postId, auteurNom) => {
    get().addNotification({
      userId,
      type: 'forum',
      titre: 'Réponse au forum',
      contenu: `${auteurNom} a répondu à votre post`,
      lien: '/forum',
      metadata: {
        forumPostId: postId,
        expediteurNom: auteurNom,
      },
    });
  },

  notifyNewActualite: (userId, titre) => {
    get().addNotification({
      userId,
      type: 'actualite',
      titre: 'Nouvelle actualité',
      contenu: titre,
      lien: '/dashboard',
    });
  },
}));
