import { Link } from 'react-router-dom';
import { GraduationCap, School, Users, Shield, Search, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-8 bg-gradient-to-r from-[#0056D2] to-[#E63946] bg-clip-text text-transparent leading-tight">
            Connectez Enseignants et Établissements
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            La plateforme de recrutement qui simplifie la mise en relation entre enseignants vacataires qualifiés 
            et établissements scolaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register" className="btn-primary inline-flex items-center justify-center min-w-[200px] h-12 text-lg">
              Créer un compte
            </Link>
            <Link to="/login" className="btn-secondary inline-flex items-center justify-center min-w-[200px] h-12 text-lg">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-center mb-16 text-3xl font-bold">Qui peut rejoindre Vacataire ?</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="card text-center group hover:border-[#E63946] p-10 flex flex-col items-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0056D2] to-[#E63946] rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">Enseignants</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Créez votre profil professionnel, partagez votre CV et trouvez des opportunités d'enseignement.
            </p>
          </div>

          <div className="card text-center group hover:border-[#E63946] p-10 flex flex-col items-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0056D2] to-[#E63946] rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <School className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">Écoles</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Publiez vos offres d'emploi et trouvez rapidement des enseignants qualifiés par matière.
            </p>
          </div>

          <div className="card text-center group hover:border-[#E63946] p-10 flex flex-col items-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0056D2] to-[#E63946] rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">Parents</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Consultez les profils d'enseignants disponibles et trouvez le prof idéal pour votre enfant.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-[#0056D2] to-[#E63946] py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-center mb-16 text-white text-3xl font-bold">Pourquoi choisir Vacataire ?</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center text-white flex flex-col items-center">
              <Search className="w-14 h-14 mx-auto mb-6 text-white/90" />
              <h4 className="mb-3 text-xl font-semibold">Recherche avancée</h4>
              <p className="text-blue-100">
                Filtrez par matière, localité et disponibilité pour trouver le candidat parfait.
              </p>
            </div>

            <div className="text-center text-white flex flex-col items-center">
              <Shield className="w-14 h-14 mx-auto mb-6 text-white/90" />
              <h4 className="mb-3 text-xl font-semibold">Sécurité garantie</h4>
              <p className="text-blue-100">
                Vos données sont protégées avec un système d'authentification sécurisé.
              </p>
            </div>

            <div className="text-center text-white flex flex-col items-center">
              <Briefcase className="w-14 h-14 mx-auto mb-6 text-white/90" />
              <h4 className="mb-3 text-xl font-semibold">Gestion simplifiée</h4>
              <p className="text-blue-100">
                Dashboard intuitif pour gérer vos offres, candidatures et profils.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="mb-6 text-4xl font-bold">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Rejoignez des centaines d'enseignants et établissements qui font confiance à Vacataire.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center justify-center min-w-[250px] h-14 text-lg">
            Créer un compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-12 mt-10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-400 gap-2">
          <p className="font-medium">&copy; 2026 Vacataire. Tous droits réservés.</p>
          <p className="text-sm opacity-80">Version 0.1.0 (Beta)</p>
        </div>
      </footer>
    </div>
  );
}
