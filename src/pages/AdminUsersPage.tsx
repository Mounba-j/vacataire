import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';

export default function AdminUsersPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au dashboard
          </button>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold mb-3">Total Utilisateurs</h1>
          <div className="text-6xl font-semibold text-[#E63946]">1247</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">+87 nouveaux utilisateurs ce mois</p>
          <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-slate-800 p-6">
            <p className="text-gray-700 dark:text-gray-300">Cette page affiche le total des utilisateurs inscrits sur la plateforme.</p>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
              <li>Enseignants, écoles et parents inclus.</li>
              <li>Métrique utile pour suivre la croissance globale.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
