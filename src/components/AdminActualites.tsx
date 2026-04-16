import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useActualiteStore, Actualite } from '../stores/actualiteStore';
import { useAuthStore } from '../stores/authStore';

export default function AdminActualites() {
  const { user } = useAuthStore();
  const { actualites, addActualite, updateActualite, deleteActualite } = useActualiteStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    type: 'info' as 'info' | 'event' | 'reminder' | 'update',
    cible: [] as ('admin' | 'enseignant' | 'ecole' | 'parent')[],
  });

  const resetForm = () => {
    setFormData({
      titre: '',
      contenu: '',
      type: 'info',
      cible: [],
    });
    setEditingActualite(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || formData.cible.length === 0) {
      alert('Veuillez sélectionner au moins une cible');
      return;
    }

    if (editingActualite) {
      updateActualite(editingActualite.id, {
        titre: formData.titre,
        contenu: formData.contenu,
        type: formData.type,
        visiblePour: formData.cible,
      });
      alert('Actualité modifiée avec succès!');
    } else {
      addActualite({
        titre: formData.titre,
        contenu: formData.contenu,
        type: formData.type,
        visiblePour: formData.cible,
        auteurNom: user.name,
      });
      alert('Actualité publiée avec succès!');
    }

    resetForm();
    setShowCreateModal(false);
  };

  const handleEdit = (actu: Actualite) => {
    setEditingActualite(actu);
    setFormData({
      titre: actu.titre,
      contenu: actu.contenu,
      type: actu.type,
      cible: actu.visiblePour as any,
    });
    setShowCreateModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      deleteActualite(id);
      alert('Actualité supprimée avec succès');
    }
  };

  const toggleCible = (role: 'admin' | 'enseignant' | 'ecole' | 'parent') => {
    setFormData((prev) => ({
      ...prev,
      cible: prev.cible.includes(role)
        ? prev.cible.filter((r) => r !== role)
        : [...prev.cible, role],
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'event':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'reminder':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'update':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3>Gestion des actualités</h3>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle actualité
          </button>
        </div>

        <div className="card">
          <div className="space-y-4">
            {actualites.map((actu) => (
              <div
                key={actu.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#E63946] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="line-clamp-1">{actu.titre}</h4>
                      <span className={`badge text-xs ${getTypeColor(actu.type)}`}>
                        {actu.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {actu.contenu}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>Par {actu.auteurNom}</span>
                      <span>•</span>
                      <span>{new Date(actu.datePublication).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{actu.vues} vues</span>
                      <span>•</span>
                      <span>Cible: {actu.visiblePour.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(actu)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-600"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(actu.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {actualites.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Aucune actualité publiée
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowCreateModal(false);
            resetForm();
          }}
        >
          <div
            className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2>{editingActualite ? 'Modifier l\'actualité' : 'Nouvelle actualité'}</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Titre de l'actualité"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="actualite-type" className="block text-sm font-medium mb-2">Type *</label>
                <select
                  id="actualite-type"
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  required
                >
                  <option value="info">Information</option>
                  <option value="event">Événement</option>
                  <option value="reminder">Rappel</option>
                  <option value="update">Mise à jour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenu *</label>
                <textarea
                  className="input"
                  rows={6}
                  placeholder="Contenu de l'actualité..."
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.contenu.length}/2000 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cible * (au moins une)</label>
                <div className="flex flex-wrap gap-2">
                  {(['admin', 'enseignant', 'ecole', 'parent'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleCible(role)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all capitalize ${
                        formData.cible.includes(role)
                          ? 'border-[#E63946] bg-blue-50 dark:bg-blue-900/20 text-[#E63946]'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingActualite ? 'Enregistrer' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
