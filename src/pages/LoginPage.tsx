import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const testAccounts = [
    { email: 'admin@vacataire.local', role: 'Admin' },
    { email: 'enseignant1@vacataire.local', role: 'Enseignant' },
    { email: 'ecole1@vacataire.local', role: 'École' },
    { email: 'parent1@vacataire.local', role: 'Parent' },
  ];

  const fillTestAccount = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#0056D2] to-[#E63946] rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2">Connexion</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Connectez-vous à votre compte Vacataire
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="input" style={{ paddingLeft: '2.5rem' }}
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    className="input" style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-[#E63946] hover:underline font-medium">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>

          {/* Test Accounts */}
          <div className="mt-8 card">
            <h4 className="mb-4 text-center">Comptes de test</h4>
            <div className="space-y-2">
              {testAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillTestAccount(account.email)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#E63946] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="font-medium">{account.role}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{account.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Mot de passe: password123
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
