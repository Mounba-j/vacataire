import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Moon, Sun, Settings, User, MessageSquare, Home, Mail } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useMessageStore } from '../stores/messageStore';
import { useNotificationStore } from '../stores/notificationStore';
import ProfilePhotoUploader from './ProfilePhotoUploader';
import ProfileEditor from './ProfileEditor';
import NotificationDropdown from './NotificationDropdown';
import NotificationTestPanel from './NotificationTestPanel';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { getUnreadCount } = useMessageStore();
  const { getUnreadCount: getUnreadNotificationCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (user) {
      setUnreadMessages(getUnreadCount(user.id));
      setUnreadNotifications(getUnreadNotificationCount(user.id));
    }
  }, [user, getUnreadCount, getUnreadNotificationCount, location]);

  // Update document title with notification count
  useEffect(() => {
    const totalUnread = unreadMessages + unreadNotifications;
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) Vacataire - Plateforme de recrutement`;
    } else {
      document.title = 'Vacataire - Plateforme de recrutement';
    }

    return () => {
      document.title = 'Vacataire - Plateforme de recrutement';
    };
  }, [unreadMessages, unreadNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'enseignant':
        return '/dashboard/enseignant';
      case 'ecole':
        return '/dashboard/ecole';
      case 'parent':
        return '/dashboard/parent';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  const canAccessForum = user?.role === 'enseignant' || user?.role === 'ecole';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0056D2] to-[#E63946] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-lg bg-gradient-to-r from-[#0056D2] to-[#E63946] bg-clip-text text-transparent">
                    Vacataire
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate(getDashboardRoute())}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === getDashboardRoute()
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-[#E63946]'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Accueil
                </button>
                {canAccessForum && (
                  <button
                    onClick={() => navigate('/forum')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === '/forum'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-[#E63946]'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Forum
                  </button>
                )}
                <button
                  onClick={() => navigate('/messages')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative ${
                    location.pathname === '/messages'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-[#E63946]'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center transform scale-90 sm:scale-100">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <NotificationDropdown />
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-blue-100 dark:border-blue-900 object-cover"
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium truncate">{user?.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowPhotoUploader(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Changer la photo de profil
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileEditor(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Modifier le profil
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Modals */}
      {showPhotoUploader && (
        <ProfilePhotoUploader onClose={() => setShowPhotoUploader(false)} />
      )}
      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}

      {/* Notification Test Panel - Dev Mode (Removed for Production) */}
    </div>
  );
}