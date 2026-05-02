import { useState } from 'react';
import { X, Save, Calendar, MapPin, DollarSign, BookOpen, FileText, Briefcase } from 'lucide-react';
import { useOffreStore } from '../stores/offreStore';
import { useAuthStore } from '../stores/authStore';

interface OffreFormProps {
  onClose: () => void;
  editOffre?: any;
}

export default function OffreForm({ onClose, editOffre }: OffreFormProps) {
  const { user } = useAuthStore();
  const { addOffre, updateOffre } = useOffreStore();
  const [formData, setFormData] = useState({
    titre: editOffre?.titre || '',
    matiere: editOffre?.matiere || '',
    niveau: editOffre?.niveau || '',
    type: editOffre?.type || '',
    ville: editOffre?.ville || user?.profile?.ville || '',
    dateDebut: editOffre?.dateDebut || '',
    dateFin: editOffre?.dateFin || '',
    tarif: editOffre?.tarif || '',
    description: editOffre?.description || '',
  });

  const matieres = [
    'Mathématiques',
    'Physique-Chimie',
    'Français',
    'Anglais',
    'Espagnol',
    'Allemand',
    'Histoire-Géographie',
    'SVT',
    'Philosophie',
    'EPS',
    'Arts plastiques',
    'Musique',
  ];

  const niveaux = [
    '6ème',
    '5ème',
    '4ème',
    '3ème',
    'Seconde',
    'Première',
    'Terminale',
  ];

  const typesContrat = [
    'CDD',
    'CDD - 3 mois',
    'CDD - 6 mois',
    'CDD - 1 an',
    'Vacation',
    'Remplacement',
    'Intérim',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editOffre) {
      updateOffre(editOffre.id, formData);
    } else {
      addOffre({
        ...formData,
        ecoleId: user?.id || 0,
        ecoleNom: user?.name || '',
        statut: 'active',
      });
    }

    alert(editOffre ? 'Offre modifiée avec succès!' : 'Offre publiée avec succès!');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2>
            {editOffre ? "Modifier l'offre" : "Publier une nouvelle offre"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Titre du poste *
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Professeur de Mathématiques"
              value={formData.titre}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Matière *
              </label>
              <select
                className="input"
                title="Matière"
                value={formData.matiere}
                onChange={(e) =>
                  setFormData({ ...formData, matiere: e.target.value })
                }
                required
              >
                <option value="">Sélectionner...</option>
                {matieres.map((matiere) => (
                  <option key={matiere} value={matiere}>
                    {matiere}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Niveau *
              </label>
              <select
                className="input"
                title="Niveau"
                value={formData.niveau}
                onChange={(e) =>
                  setFormData({ ...formData, niveau: e.target.value })
                }
                required
              >
                <option value="">Sélectionner...</option>
                {niveaux.map((niveau) => (
                  <option key={niveau} value={niveau}>
                    {niveau}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Type de contrat *
              </label>
              <select
                className="input"
                title="Type de contrat"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="">Sélectionner...</option>
                {typesContrat.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ville *
              </label>
              <input
                type="text"
                className="input"
                placeholder="Paris"
                value={formData.ville}
                onChange={(e) =>
                  setFormData({ ...formData, ville: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de début *
              </label>
              <input
                type="date"
                className="input"
                placeholder="Sélectionner une date"
                value={formData.dateDebut}
                onChange={(e) =>
                  setFormData({ ...formData, dateDebut: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                className="input"
                placeholder="Sélectionner une date"
                value={formData.dateFin}
                onChange={(e) =>
                  setFormData({ ...formData, dateFin: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Tarif horaire *
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ex: 45 Cfa/h"
              value={formData.tarif}
              onChange={(e) =>
                setFormData({ ...formData, tarif: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Indiquez le tarif horaire proposé
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description du poste *
            </label>
            <textarea
              className="input"
              rows={5}
              placeholder="Décrivez le poste, les responsabilités, les qualifications requises..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum 50 caractères
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {editOffre ? "Enregistrer" : "Publier l'offre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
