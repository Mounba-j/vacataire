import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardEnseignant from './pages/DashboardEnseignant';
import DashboardEcole from './pages/DashboardEcole';
import DashboardParent from './pages/DashboardParent';
import DashboardAdmin from './pages/DashboardAdmin';
import ForumPage from './pages/ForumPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import { useEffect } from 'react';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return '/';
    
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <RegisterPage />} />
        
        <Route
          path="/dashboard/enseignant"
          element={
            <ProtectedRoute allowedRoles={['enseignant']}>
              <DashboardEnseignant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ecole"
          element={
            <ProtectedRoute allowedRoles={['ecole']}>
              <DashboardEcole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <DashboardParent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute allowedRoles={['enseignant', 'ecole']}>
              <ForumPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRoles={['enseignant', 'ecole', 'parent', 'admin']}>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['enseignant', 'ecole', 'parent', 'admin']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;