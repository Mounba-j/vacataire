import { useState } from 'react';
import { Search, Ban, CheckCircle, Mail, Eye } from 'lucide-react';
import { useAdminStore, UserManagement } from '../stores/adminStore';
import { useMessageStore } from '../stores/messageStore';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function AdminUserManagement() {
  const { user: admin } = useAuthStore();
  const { users, suspendreUser, reactiverUser, getUsersByRole } = useAdminStore();
  const { getOrCreateConversation, sendMessage } = useMessageStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('tous');
  const [statutFilter, setStatutFilter] = useState('tous');
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [showContactModal, setShowContactModal] = useState<UserManagement | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const filteredUsers = getUsersByRole(roleFilter).filter((u) => {
    const matchesSearch =
      u.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatut = statutFilter === 'tous' || u.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const handleSuspendre = (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir suspendre ce compte ?')) {
      suspendreUser(userId);
      setSelectedUser(null);
    }
  };

  const handleReactiver = (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir réactiver ce compte ?')) {
      reactiverUser(userId);
      setSelectedUser(null);
    }
  };

  const handleContact = (user: UserManagement) => {
    setShowContactModal(user);
    setContactMessage('');
  };

  const handleSendMessage = () => {
    if (!admin || !showContactModal || !contactMessage.trim()) return;

    const conversationId = getOrCreateConversation(
      admin.id,
      showContactModal.id,
      {
        nom: admin.name,
        avatar: admin.avatar,
        role: admin.role,
      },
      {
        nom: showContactModal.nom,
        avatar: showContactModal.avatar,
        role: showContactModal.role,
      }
    );

    sendMessage({
      conversationId,
      expediteurId: admin.id,
      expediteurNom: admin.name,
      expediteurAvatar: admin.avatar || '',
      expediteurRole: admin.role,
      contenu: contactMessage,
    });

    setShowContactModal(null);
    setContactMessage('');
    alert('Message envoyé avec succès!');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="input" style={{ paddingLeft: '2.5rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input md:w-48"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="tous">Tous les rôles</option>
              <option value="enseignant">Enseignants</option>
              <option value="ecole">Écoles</option>
              <option value="parent">Parents</option>
            </select>
            <select
              className="input md:w-48"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actifs</option>
              <option value="suspendu">Suspendus</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4">Utilisateur</th>
                <th className="text-left p-4">Rôle</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-left p-4">Inscription</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.nom}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{u.nom}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize badge badge-primary">{u.role}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        u.statut === 'actif' ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {u.statut === 'actif' ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(u.dateInscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleContact(u)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-600"
                        title="Contacter"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      {u.statut === 'actif' ? (
                        <button
                          onClick={() => handleSuspendre(u.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600"
                          title="Suspendre"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactiver(u.id)}
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-600"
                          title="Réactiver"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="card max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2>Détails de l'utilisateur</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.nom}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h3>{selectedUser.nom}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Rôle</h4>
                  <span className="capitalize badge badge-primary">
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <h4 className="mb-2">Statut</h4>
                  <span
                    className={`badge ${
                      selectedUser.statut === 'actif'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {selectedUser.statut === 'actif' ? 'Actif' : 'Suspendu'}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Date d'inscription</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(selectedUser.dateInscription).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">Dernière connexion</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(selectedUser.derniereConnexion).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedUser.statut === 'actif' ? (
                  <button
                    onClick={() => handleSuspendre(selectedUser.id)}
                    className="flex-1 btn-secondary text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Suspendre le compte
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactiver(selectedUser.id)}
                    className="flex-1 btn-primary"
                  >
                    Réactiver le compte
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowContactModal(null)}
        >
          <div
            className="card max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2>Contacter {showContactModal.nom}</h2>
              <button onClick={() => setShowContactModal(null)} className="text-gray-500">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="input"
                  rows={6}
                  placeholder="Écrivez votre message..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowContactModal(null)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!contactMessage.trim()}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
