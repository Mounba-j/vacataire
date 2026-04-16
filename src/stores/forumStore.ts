import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';

export interface ForumPost {
  id: number;
  auteurId: number;
  auteurNom: string;
  auteurRole: 'enseignant' | 'ecole';
  auteurAvatar: string;
  titre: string;
  contenu: string;
  datePublication: string;
  likes: number;
  likedBy: number[];
  reponses: ForumReponse[];
  tags?: string[];
}

export interface ForumReponse {
  id: number;
  auteurId: number;
  auteurNom: string;
  auteurRole: 'enseignant' | 'ecole';
  auteurAvatar: string;
  contenu: string;
  datePublication: string;
  likes: number;
  likedBy: number[];
}

interface ForumState {
  posts: ForumPost[];
  addPost: (post: Omit<ForumPost, 'id' | 'datePublication' | 'likes' | 'likedBy' | 'reponses'>) => void;
  addReponse: (postId: number, reponse: Omit<ForumReponse, 'id' | 'datePublication' | 'likes' | 'likedBy'>) => void;
  toggleLikePost: (postId: number, userId: number) => void;
  toggleLikeReponse: (postId: number, reponseId: number, userId: number) => void;
  deletePost: (postId: number) => void;
  deleteReponse: (postId: number, reponseId: number) => void;
}

const mockPosts: ForumPost[] = [
  {
    id: 1,
    auteurId: 2,
    auteurNom: 'Marie Dupont',
    auteurRole: 'enseignant',
    auteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    titre: 'Quelle est votre expérience avec les classes de Terminale?',
    contenu: 'Bonjour à tous! Je commence bientôt un poste en Terminale S et j\'aimerais avoir vos retours d\'expérience. Quelles sont les principales difficultés que vous rencontrez avec ce niveau? Merci!',
    datePublication: '2026-01-25',
    likes: 12,
    likedBy: [3, 4, 5],
    tags: ['terminale', 'conseils', 'mathématiques'],
    reponses: [
      {
        id: 1,
        auteurId: 3,
        auteurNom: 'Lycée Victor Hugo',
        auteurRole: 'ecole',
        auteurAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=victor',
        contenu: 'De mon expérience, la principale difficulté est la gestion du stress lié au bac. N\'hésitez pas à organiser des sessions de révision régulières.',
        datePublication: '2026-01-25',
        likes: 5,
        likedBy: [2, 4],
      },
      {
        id: 2,
        auteurId: 5,
        auteurNom: 'Thomas Petit',
        auteurRole: 'enseignant',
        auteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
        contenu: 'Je suis d\'accord! J\'ajoute qu\'il faut vraiment adapter son rythme et proposer beaucoup d\'exercices pratiques. Les élèves apprécient les exemples concrets.',
        datePublication: '2026-01-26',
        likes: 8,
        likedBy: [2, 3],
      },
    ],
  },
  {
    id: 2,
    auteurId: 3,
    auteurNom: 'Lycée Victor Hugo',
    auteurRole: 'ecole',
    auteurAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=victor',
    titre: 'Recherche enseignant remplaçant urgent - Mathématiques',
    contenu: 'Bonjour, nous recherchons un enseignant de mathématiques pour un remplacement urgent (congé maladie) à partir du 1er février. Classes de Seconde. Si quelqu\'un est disponible, merci de nous contacter rapidement!',
    datePublication: '2026-01-28',
    likes: 6,
    likedBy: [2, 5],
    tags: ['urgence', 'remplacement', 'mathématiques'],
    reponses: [
      {
        id: 3,
        auteurId: 2,
        auteurNom: 'Marie Dupont',
        auteurRole: 'enseignant',
        auteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
        contenu: 'Bonjour, je suis potentiellement disponible. Je vous contacte en privé pour plus de détails.',
        datePublication: '2026-01-28',
        likes: 3,
        likedBy: [3],
      },
    ],
  },
  {
    id: 3,
    auteurId: 5,
    auteurNom: 'Thomas Petit',
    auteurRole: 'enseignant',
    auteurAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
    titre: 'Partage de ressources pédagogiques',
    contenu: 'Salut! J\'ai créé une série d\'exercices interactifs pour les mathématiques niveau lycée. Si ça intéresse quelqu\'un, n\'hésitez pas à me contacter, je partage volontiers mes ressources!',
    datePublication: '2026-01-29',
    likes: 18,
    likedBy: [2, 3, 4, 6, 7],
    tags: ['ressources', 'partage', 'mathématiques'],
    reponses: [],
  },
];

export const useForumStore = create<ForumState>((set, get) => ({
  posts: mockPosts,

  addPost: (post) => {
    const newPost: ForumPost = {
      ...post,
      id: Math.max(0, ...get().posts.map(p => p.id)) + 1,
      datePublication: new Date().toISOString().split('T')[0],
      likes: 0,
      likedBy: [],
      reponses: [],
    };
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },

  addReponse: (postId, reponse) => {
    const newReponse: ForumReponse = {
      ...reponse,
      id: Math.max(0, ...get().posts.flatMap(p => p.reponses).map(r => r.id)) + 1,
      datePublication: new Date().toISOString().split('T')[0],
      likes: 0,
      likedBy: [],
    };

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, reponses: [...post.reponses, newReponse] }
          : post
      ),
    }));

    // Notify the original post author about the reply
    const post = get().posts.find(p => p.id === postId);
    if (post && post.auteurId !== reponse.auteurId) {
      useNotificationStore.getState().notifyForumReply(
        post.auteurId,
        postId,
        reponse.auteurNom
      );
    }
  },

  toggleLikePost: (postId, userId) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          const likedBy = post.likedBy.includes(userId)
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId];
          return { ...post, likes: likedBy.length, likedBy };
        }
        return post;
      }),
    }));
  },

  toggleLikeReponse: (postId, reponseId, userId) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reponses: post.reponses.map((reponse) => {
              if (reponse.id === reponseId) {
                const likedBy = reponse.likedBy.includes(userId)
                  ? reponse.likedBy.filter(id => id !== userId)
                  : [...reponse.likedBy, userId];
                return { ...reponse, likes: likedBy.length, likedBy };
              }
              return reponse;
            }),
          };
        }
        return post;
      }),
    }));
  },

  deletePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },

  deleteReponse: (postId, reponseId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, reponses: post.reponses.filter(r => r.id !== reponseId) }
          : post
      ),
    }));
  },
}));