import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Briefcase, Users, FileText, Newspaper, Shield, Trash2, Check, CheckCheck, Filter } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore, NotificationType } from '../stores/notificationStore';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    getNotificationsByUser, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAllNotifications
  } = useNotificationStore();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, filter, typeFilter]);

  const loadNotifications = () => {
    if (!user) return;
    let notifs = getNotificationsByUser(user.id);
    
    if (filter === 'unread') {
      notifs = notifs.filter(n => !n.lue);
    }
    
    if (typeFilter !== 'all') {
      notifs = notifs.filter(n => n.type === typeFilter);
    }
    
    setNotifications(notifs);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.lue) {
      markAsRead(notification.id);
    }
    if (notification.lien) {
      navigate(notification.lien);
    }
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
      loadNotifications();
    }
  };

  const handleClearAll = () => {
    if (user && window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      clearAllNotifications(user.id);
      loadNotifications();
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    deleteNotification(notificationId);
    loadNotifications();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'offre':
      case 'candidature':
        return <Briefcase className="w-5 h-5" />;
      case 'forum':
        return <Users className="w-5 h-5" />;
      case 'cv':
        return <FileText className="w-5 h-5" />;
      case 'actualite':
        return <Newspaper className="w-5 h-5" />;
      case 'admin':
      case 'system':
        return <Shield className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'offre':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'candidature':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'forum':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'cv':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
      case 'actualite':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400';
      case 'admin':
      case 'system':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'À l\'instant';
    if (diffInMins < 60) return `Il y a ${diffInMins} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const unreadCount = notifications.filter(n => !n.lue).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications sont lues'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 bg-[#E63946] hover:bg-[#0056D2] text-white rounded-lg transition-colors text-sm"
                >
                  <CheckCheck className="w-4 h-4" />
                  Tout marquer comme lu
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Tout supprimer
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === 'unread'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              Non lues
            </button>
            <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                typeFilter === 'all'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              Tous types
            </button>
            <button
              onClick={() => setTypeFilter('message')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                typeFilter === 'message'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setTypeFilter('offre')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                typeFilter === 'offre'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              Offres
            </button>
            {user?.role === 'ecole' && (
              <button
                onClick={() => setTypeFilter('candidature')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  typeFilter === 'candidature'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Candidatures
              </button>
            )}
            {(user?.role === 'enseignant' || user?.role === 'ecole') && (
              <button
                onClick={() => setTypeFilter('forum')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  typeFilter === 'forum'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Forum
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'unread' 
                  ? 'Vous avez lu toutes vos notifications'
                  : 'Vous n\'avez pas encore de notifications'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                    !notification.lue ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className={`font-medium ${!notification.lue ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notification.titre}
                        </h3>
                        {!notification.lue && (
                          <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.contenu}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(notification.dateCreation)}
                        </span>
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
