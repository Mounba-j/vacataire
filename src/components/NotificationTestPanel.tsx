import { useState } from 'react';
import { Bell, MessageSquare, Briefcase, Users, Newspaper, X } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

export default function NotificationTestPanel() {
  const { user } = useAuthStore();
  const { 
    notifyNewMessage, 
    notifyNewOffre, 
    notifyNewCandidature, 
    notifyForumReply, 
    notifyNewActualite,
    addNotification
  } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleTestNotification = (type: string) => {
    switch (type) {
      case 'message':
        notifyNewMessage(user.id, 999, 'Test Utilisateur');
        break;
      case 'offre':
        notifyNewOffre(user.id, 'Professeur de Physique-Chimie - Paris', 999);
        break;
      case 'candidature':
        notifyNewCandidature(user.id, 'Jean Dupont', 1);
        break;
      case 'forum':
        notifyForumReply(user.id, 1, 'Sophie Martin');
        break;
      case 'actualite':
        notifyNewActualite(user.id, 'Nouvelle fonctionnalité disponible sur la plateforme');
        break;
      case 'custom':
        addNotification({
          userId: user.id,
          type: 'system',
          titre: 'Notification personnalisée',
          contenu: 'Ceci est un exemple de notification personnalisée',
          lien: '/dashboard',
        });
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#E63946] hover:bg-[#0056D2] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
      >
        <Bell className="w-4 h-4" />
        Test Notifications
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Tester les notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <button
              onClick={() => handleTestNotification('message')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Nouveau message
            </button>
            
            <button
              onClick={() => handleTestNotification('offre')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-left transition-colors"
            >
              <Briefcase className="w-4 h-4 text-green-500" />
              Nouvelle offre
            </button>
            
            {user.role === 'ecole' && (
              <button
                onClick={() => handleTestNotification('candidature')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-left transition-colors"
              >
                <Briefcase className="w-4 h-4 text-purple-500" />
                Nouvelle candidature
              </button>
            )}
            
            {(user.role === 'enseignant' || user.role === 'ecole') && (
              <button
                onClick={() => handleTestNotification('forum')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-left transition-colors"
              >
                <Users className="w-4 h-4 text-orange-500" />
                Réponse au forum
              </button>
            )}
            
            <button
              onClick={() => handleTestNotification('actualite')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-left transition-colors"
            >
              <Newspaper className="w-4 h-4 text-cyan-500" />
              Nouvelle actualité
            </button>
            
            <button
              onClick={() => handleTestNotification('custom')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20 text-left transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              Notification personnalisée
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Cliquez sur un bouton pour générer une notification de test
          </p>
        </div>
      )}
    </div>
  );
}
