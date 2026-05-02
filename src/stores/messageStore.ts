import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';

export interface Message {
  id: number;
  conversationId: number;
  expediteurId: number;
  expediteurNom: string;
  expediteurAvatar: string;
  expediteurRole: string;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
}

export interface Conversation {
  id: number;
  participants: {
    id: number;
    nom: string;
    avatar: string;
    role: string;
  }[];
  dernierMessage?: Message;
  messagesNonLus: number;
  dateModification: string;
}

interface MessageState {
  conversations: Conversation[];
  messages: Message[];
  getConversationsByUser: (userId: number) => Conversation[];
  getMessagesByConversation: (conversationId: number) => Message[];
  sendMessage: (message: Omit<Message, 'id' | 'dateEnvoi' | 'lu'>) => void;
  markAsRead: (conversationId: number, userId: number) => void;
  createConversation: (userId: number, targetUserId: number, userInfo: any, targetInfo: any) => number;
  getOrCreateConversation: (userId: number, targetUserId: number, userInfo: any, targetInfo: any) => number;
  getUnreadCount: (userId: number) => number;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [
      {
        id: 2,
        nom: 'Marie Dupont',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
        role: 'enseignant',
      },
      {
        id: 3,
        nom: 'Lycée Victor Hugo',
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=victor',
        role: 'ecole',
      },
    ],
    messagesNonLus: 1,
    dateModification: '2026-01-30T14:30:00',
  },
  {
    id: 2,
    participants: [
      {
        id: 2,
        nom: 'Marie Dupont',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
        role: 'enseignant',
      },
      {
        id: 4,
        nom: 'Sophie Martin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
        role: 'parent',
      },
    ],
    messagesNonLus: 0,
    dateModification: '2026-01-29T10:15:00',
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    expediteurId: 3,
    expediteurNom: 'Lycée Victor Hugo',
    expediteurAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=victor',
    expediteurRole: 'ecole',
    contenu: 'Bonjour Marie, nous avons reçu votre candidature pour le poste de professeur de mathématiques. Seriez-vous disponible pour un entretien la semaine prochaine ?',
    dateEnvoi: '2026-01-30T14:30:00',
    lu: false,
  },
  {
    id: 2,
    conversationId: 1,
    expediteurId: 2,
    expediteurNom: 'Marie Dupont',
    expediteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    expediteurRole: 'enseignant',
    contenu: 'Bonjour, oui bien sûr ! Je suis disponible en semaine. Quel jour vous conviendrait le mieux ?',
    dateEnvoi: '2026-01-30T14:25:00',
    lu: true,
  },
  {
    id: 3,
    conversationId: 2,
    expediteurId: 4,
    expediteurNom: 'Sophie Martin',
    expediteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
    expediteurRole: 'parent',
    contenu: 'Bonjour, je suis intéressée par des cours de mathématiques pour ma fille en classe de Première. Quels sont vos disponibilités ?',
    dateEnvoi: '2026-01-29T10:15:00',
    lu: true,
  },
  {
    id: 4,
    conversationId: 2,
    expediteurId: 2,
    expediteurNom: 'Marie Dupont',
    expediteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    expediteurRole: 'enseignant',
    contenu: "Bonjour Sophie, je serais ravie d'aider votre fille. Je suis disponible les mercredis après-midi et les samedis. Mon tarif est de 45 Cfa/h.",
    dateEnvoi: '2026-01-29T10:10:00',
    lu: true,
  },
];

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: mockConversations,
  messages: mockMessages,

  getConversationsByUser: (userId) => {
    const convs = get().conversations.filter((conv) =>
      conv.participants.some((p) => p.id === userId)
    );

    // Add last message to each conversation
    return convs.map((conv) => {
      const messages = get().messages
        .filter((m) => m.conversationId === conv.id)
        .sort((a, b) => new Date(b.dateEnvoi).getTime() - new Date(a.dateEnvoi).getTime());
      
      const dernierMessage = messages[0];
      const messagesNonLus = messages.filter(
        (m) => !m.lu && m.expediteurId !== userId
      ).length;

      return {
        ...conv,
        dernierMessage,
        messagesNonLus,
      };
    }).sort((a, b) => 
      new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime()
    );
  },

  getMessagesByConversation: (conversationId) => {
    return get().messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.dateEnvoi).getTime() - new Date(b.dateEnvoi).getTime());
  },

  sendMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Math.max(0, ...get().messages.map(m => m.id)) + 1,
      dateEnvoi: new Date().toISOString(),
      lu: false,
    };

    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            dateModification: newMessage.dateEnvoi,
          };
        }
        return conv;
      });

      return {
        messages: [...state.messages, newMessage],
        conversations: updatedConversations,
      };
    });

    // Notify the recipient
    const conversation = get().conversations.find(c => c.id === message.conversationId);
    if (conversation) {
      const recipient = conversation.participants.find(p => p.id !== message.expediteurId);
      if (recipient) {
        useNotificationStore.getState().notifyNewMessage(
          recipient.id,
          message.expediteurId,
          message.expediteurNom
        );
      }
    }
  },

  markAsRead: (conversationId, userId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.conversationId === conversationId && m.expediteurId !== userId
          ? { ...m, lu: true }
          : m
      ),
    }));
  },

  createConversation: (userId, targetUserId, userInfo, targetInfo) => {
    const newConversation: Conversation = {
      id: Math.max(0, ...get().conversations.map(c => c.id)) + 1,
      participants: [
        {
          id: userId,
          nom: userInfo.nom,
          avatar: userInfo.avatar,
          role: userInfo.role,
        },
        {
          id: targetUserId,
          nom: targetInfo.nom,
          avatar: targetInfo.avatar,
          role: targetInfo.role,
        },
      ],
      messagesNonLus: 0,
      dateModification: new Date().toISOString(),
    };

    set((state) => ({
      conversations: [...state.conversations, newConversation],
    }));

    return newConversation.id;
  },

  getOrCreateConversation: (userId, targetUserId, userInfo, targetInfo) => {
    const existing = get().conversations.find((conv) =>
      conv.participants.some((p) => p.id === userId) &&
      conv.participants.some((p) => p.id === targetUserId)
    );

    if (existing) {
      return existing.id;
    }

    return get().createConversation(userId, targetUserId, userInfo, targetInfo);
  },

  getUnreadCount: (userId) => {
    const conversations = get().getConversationsByUser(userId);
    return conversations.reduce((acc, conv) => acc + conv.messagesNonLus, 0);
  },
}));
