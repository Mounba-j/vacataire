import { Link } from 'react-router-dom';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useEffect } from 'react';

export default function Navbar() {
  const { isDark, toggleTheme, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 font-semibold text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0056D2] to-[#E63946] rounded-lg flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#0056D2] to-[#E63946] bg-clip-text text-transparent text-2xl tracking-tight">
              Vacataire
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-[#0056D2] transition-colors font-medium">
              Connexion
            </Link>
            <Link to="/register" className="btn-primary inline-flex items-center justify-center h-10 px-5 rounded-lg shadow hover:shadow-md">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
