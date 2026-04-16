import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'enseignant' as 'enseignant' | 'ecole' | 'parent',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
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
            <h1 className="mb-2">Créer un compte</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Rejoignez la communauté Vacataire
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
                <label className="block text-sm font-medium mb-2">Type de compte</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['enseignant', 'ecole', 'parent'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                        formData.role === role
                          ? 'border-[#E63946] bg-blue-50 dark:bg-blue-900/20 text-[#E63946]'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {role === 'enseignant' ? 'Enseignant' : role === 'ecole' ? 'École' : 'Parent'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="input" style={{ paddingLeft: '2.5rem' }}
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="input" style={{ paddingLeft: '2.5rem' }}
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    className="input" style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-[#E63946] hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
