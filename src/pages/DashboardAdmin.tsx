import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  School,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Activity,
  UserCheck,
  FileText,
  MessageSquare,
  Newspaper,
  Shield,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import DashboardLayout from "../components/DashboardLayout";
import AdminUserManagement from "../components/AdminUserManagement";
import AdminForumModeration from "../components/AdminForumModeration";
import AdminActualites from "../components/AdminActualites";

interface Stats {
  totalUsers: number;
  totalEnseignants: number;
  totalEcoles: number;
  totalParents: number;
  totalOffres: number;
  totalCandidatures: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

const mockStats: Stats = {
  totalUsers: 1247,
  totalEnseignants: 523,
  totalEcoles: 186,
  totalParents: 538,
  totalOffres: 94,
  totalCandidatures: 312,
  activeUsers: 892,
  newUsersThisMonth: 87,
};

const recentActivities = [
  {
    id: 1,
    type: "user",
    message: "Nouvel enseignant inscrit: Marie Dupont",
    time: "Il y a 5 min",
  },
  {
    id: 2,
    type: "offre",
    message: "Nouvelle offre publiée par Lycée Victor Hugo",
    time: "Il y a 12 min",
  },
  {
    id: 3,
    type: "candidature",
    message: "Candidature soumise pour Professeur de Mathématiques",
    time: "Il y a 23 min",
  },
  {
    id: 4,
    type: "user",
    message: "Nouvelle école inscrite: Collège Jean Moulin",
    time: "Il y a 1h",
  },
  {
    id: 5,
    type: "user",
    message: "Nouveau parent inscrit: Sophie Martin",
    time: "Il y a 2h",
  },
];

const topEnseignants = [
  {
    id: 1,
    nom: "Marie Dupont",
    matiere: "Mathématiques",
    candidatures: 15,
    rating: 4.9,
  },
  {
    id: 2,
    nom: "Pierre Martin",
    matiere: "Physique-Chimie",
    candidatures: 12,
    rating: 4.8,
  },
  {
    id: 3,
    nom: "Jean Dubois",
    matiere: "Anglais",
    candidatures: 10,
    rating: 4.7,
  },
  {
    id: 4,
    nom: "Sophie Bernard",
    matiere: "Français",
    candidatures: 9,
    rating: 4.6,
  },
  {
    id: 5,
    nom: "Thomas Petit",
    matiere: "Mathématiques",
    candidatures: 8,
    rating: 4.9,
  },
];

export default function DashboardAdmin() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "users" | "forum" | "actualites"
  >("overview");
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="mb-2">Dashboard Administrateur</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Bienvenue, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Administrateur</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex flex-wrap justify-center items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
            {(["overview", "users", "forum", "actualites"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`min-w-[170px] px-5 py-3 text-center rounded-2xl font-semibold transition-all border ${
                    selectedTab === tab
                      ? "bg-[#E63946] text-white border-transparent shadow-lg shadow-[#E63946]/20"
                      : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab === "overview" && "Vue d'ensemble"}
                  {tab === "users" && "Gestion Utilisateurs"}
                  {tab === "forum" && "Modération Forum"}
                  {tab === "actualites" && "Actualités"}
                </button>
              ),
            )}
          </div>
        </div>

        {selectedTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className="card hover:shadow-lg transition-all cursor-pointer transform-gpu hover:-translate-y-1 active:scale-[0.98]"
                onClick={() => navigate("/dashboard/admin/utilisateurs")}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-600 dark:text-gray-400">
                    Total Utilisateurs
                  </h4>
                  <Users className="w-8 h-8 text-[#E63946]" />
                </div>
                <div className="text-3xl font-semibold mb-1">
                  {mockStats.totalUsers}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />+
                  {mockStats.newUsersThisMonth} ce mois
                </div>
              </div>

              <div
                className="card hover:shadow-lg transition-all cursor-pointer transform-gpu hover:-translate-y-1 active:scale-[0.98]"
                onClick={() => navigate("/dashboard/admin/enseignants")}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-600 dark:text-gray-400">
                    Enseignants
                  </h4>
                  <GraduationCap className="w-8 h-8 text-[#E63946]" />
                </div>
                <div className="text-3xl font-semibold mb-1">
                  {mockStats.totalEnseignants}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(
                    (mockStats.totalEnseignants / mockStats.totalUsers) * 100,
                  )}
                  % du total
                </div>
              </div>

              <div
                className="card hover:shadow-lg transition-all cursor-pointer transform-gpu hover:-translate-y-1 active:scale-[0.98]"
                onClick={() => navigate("/dashboard/admin/ecoles")}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-600 dark:text-gray-400">Écoles</h4>
                  <School className="w-8 h-8 text-[#E63946]" />
                </div>
                <div className="text-3xl font-semibold mb-1">
                  {mockStats.totalEcoles}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {mockStats.totalOffres} offres actives
                </div>
              </div>

              <div
                className="card hover:shadow-lg transition-all cursor-pointer transform-gpu hover:-translate-y-1 active:scale-[0.98]"
                onClick={() => navigate("/dashboard/admin/candidatures")}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-600 dark:text-gray-400">
                    Candidatures
                  </h4>
                  <FileText className="w-8 h-8 text-[#E63946]" />
                </div>
                <div className="text-3xl font-semibold mb-1">
                  {mockStats.totalCandidatures}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pour {mockStats.totalOffres} offres
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="card">
                <h3 className="mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#E63946]" />
                  Activités récentes
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.type === "user"
                            ? "bg-blue-500"
                            : activity.type === "offre"
                              ? "bg-green-500"
                              : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Enseignants */}
              <div className="card">
                <h3 className="mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#E63946]" />
                  Top Enseignants
                </h3>
                <div className="space-y-3">
                  {topEnseignants.map((ens, index) => (
                    <div
                      key={ens.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0056D2] to-[#E63946] flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{ens.nom}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {ens.matiere}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#E63946]">
                          {ens.candidatures}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          candidatures
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribution Stats */}
            <div className="card">
              <h3 className="mb-4">Répartition des utilisateurs</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <GraduationCap className="w-10 h-10 mx-auto mb-2 text-[#E63946]" />
                  <div className="text-2xl font-semibold mb-1">
                    {mockStats.totalEnseignants}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Enseignants
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round(
                      (mockStats.totalEnseignants / mockStats.totalUsers) * 100,
                    )}
                    %
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <School className="w-10 h-10 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-semibold mb-1">
                    {mockStats.totalEcoles}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Écoles
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round(
                      (mockStats.totalEcoles / mockStats.totalUsers) * 100,
                    )}
                    %
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <Users className="w-10 h-10 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-semibold mb-1">
                    {mockStats.totalParents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Parents
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round(
                      (mockStats.totalParents / mockStats.totalUsers) * 100,
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === "users" && <AdminUserManagement />}

        {selectedTab === "forum" && <AdminForumModeration />}

        {selectedTab === "actualites" && <AdminActualites />}
      </div>
    </DashboardLayout>
  );
}