import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, MessageSquare, Briefcase, Users, FileText, Newspaper, Shield, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore, NotificationType } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    getNotificationsByUser, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Refresh notifications when user or dropdown state changes
  useEffect(() => {
    if (user) {
      const refreshNotifications = () => {
        setNotifications(getNotificationsByUser(user.id).slice(0, 10)); // Limit to 10 most recent
        setUnreadCount(getUnreadCount(user.id));
      };
      
      refreshNotifications();
      
      // Auto-refresh every 30 seconds when dropdown is open
      if (showDropdown) {
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [user, getNotificationsByUser, getUnreadCount, showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'offre':
      case 'candidature':
        return <Briefcase className="w-4 h-4" />;
      case 'forum':
        return <Users className="w-4 h-4" />;
      case 'cv':
        return <FileText className="w-4 h-4" />;
      case 'actualite':
        return <Newspaper className="w-4 h-4" />;
      case 'admin':
      case 'system':
        return <Shield className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
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

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setShowDropdown(false);
    if (notification.lien) {
      navigate(notification.lien);
    }
    // Refresh notifications
    if (user) {
      setNotifications(getNotificationsByUser(user.id).slice(0, 10)); // Limit to 10 most recent
      setUnreadCount(getUnreadCount(user.id));
    }
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
      setNotifications(getNotificationsByUser(user.id).slice(0, 10)); // Limit to 10 most recent
      setUnreadCount(0);
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    deleteNotification(notificationId);
    if (user) {
      setNotifications(getNotificationsByUser(user.id).slice(0, 10)); // Limit to 10 most recent
      setUnreadCount(getUnreadCount(user.id));
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
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#E63946] hover:underline flex items-center gap-1"
                  title="Tout marquer comme lu"
                >
                  <Check className="w-3 h-3" />
                  Tout lire
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Aucune notification
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                      !notification.lue
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${!notification.lue ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {notification.titre}
                          </p>
                          {!notification.lue && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                          {notification.contenu}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(notification.dateCreation)}
                          </span>
                          <button
                            onClick={(e) =>
                              handleDeleteNotification(e, notification.id)
                            }
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - View All Link */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setShowDropdown(false);
                }}
                className="w-full text-center text-sm text-[#E63946] hover:underline flex items-center justify-center gap-1"
              >
                Voir toutes les notifications
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}