import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, FileText, X, Save, Camera } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import ProfilePhotoUploader from './ProfilePhotoUploader';

interface ProfileEditorProps {
  onClose: () => void;
}

export default function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, updateUserProfile } = useAuthStore();
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telephone: user?.profile?.telephone || '',
    ville: user?.profile?.ville || user?.profile?.adresse || '',
    matiere: user?.profile?.matiere || '',
    experience: user?.profile?.experience || '',
    tarif: user?.profile?.tarif || '',
    bio: user?.profile?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      profile: {
        ...user?.profile,
        telephone: formData.telephone,
        ville: formData.ville,
        matiere: formData.matiere,
        experience: formData.experience,
        tarif: formData.tarif,
        bio: formData.bio,
      },
    });
    
    alert('Profil mis à jour avec succès!');
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2>Modifier mon profil</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-blue-100 dark:border-blue-900 object-cover"
              />
              <button
                onClick={() => setShowPhotoUploader(true)}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Changer la photo"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <button
              onClick={() => setShowPhotoUploader(true)}
              className="mt-2 text-sm text-[#E63946] hover:underline"
            >
              Modifier la photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Nom complet
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ville
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Paris"
                  value={formData.ville}
                  onChange={(e) =>
                    setFormData({ ...formData, ville: e.target.value })
                  }
                />
              </div>
            </div>

            {user?.role === "enseignant" && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Matière enseignée
                    </label>
                    <select
                      className="input"
                      value={formData.matiere}
                      onChange={(e) =>
                        setFormData({ ...formData, matiere: e.target.value })
                      }
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Mathématiques">Mathématiques</option>
                      <option value="Physique-Chimie">Physique-Chimie</option>
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Histoire-Géographie">
                        Histoire-Géographie
                      </option>
                      <option value="SVT">SVT</option>
                      <option value="Philosophie">Philosophie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Tarif horaire
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Ex: 45 Cfa/h"
                      value={formData.tarif}
                      onChange={(e) =>
                        setFormData({ ...formData, tarif: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Expérience
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="5 ans"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Biographie / Présentation
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Parlez de votre parcours, votre méthode pédagogique..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </div>
              </>
            )}

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
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Photo Uploader Modal */}
      {showPhotoUploader && (
        <ProfilePhotoUploader onClose={() => setShowPhotoUploader(false)} />
      )}
    </>
  );
}
