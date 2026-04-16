import { useEffect, useState } from 'react';
import { Newspaper, Calendar, Eye, X } from 'lucide-react';
import { useActualiteStore, Actualite } from '../stores/actualiteStore';
import { useAuthStore } from '../stores/authStore';

export default function ActualitesPanel() {
  const { user } = useAuthStore();
  const { getActualitesByRole, incrementVues } = useActualiteStore();
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [selectedActualite, setSelectedActualite] = useState<Actualite | null>(null);

  useEffect(() => {
    if (user?.role) {
      setActualites(getActualitesByRole(user.role));
    }
  }, [user, getActualitesByRole]);

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'info':
        return 'Info';
      case 'event':
        return 'Événement';
      case 'reminder':
        return 'Rappel';
      case 'update':
        return 'Mise à jour';
      default:
        return type;
    }
  };

  const handleActualiteClick = (actualite: Actualite) => {
    incrementVues(actualite.id);
    setSelectedActualite(actualite);
  };

  return (
    <>
      <div className="space-y-3">
        {actualites.slice(0, 5).map((actu) => (
          <div
            key={actu.id}
            className="card hover:shadow-md cursor-pointer transition-all"
            onClick={() => handleActualiteClick(actu)}
          >
            <div className="flex gap-3">
              <Newspaper className="w-5 h-5 text-[#E63946] flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm line-clamp-2 flex-1">{actu.titre}</h4>
                  <span className={`badge text-xs ${getTypeColor(actu.type)} flex-shrink-0`}>
                    {getTypeLabel(actu.type)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(actu.datePublication).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {actu.vues}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {actualites.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune actualité disponible</p>
          </div>
        )}
      </div>

      {/* Modal Actualité Détail */}
      {selectedActualite && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedActualite(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${getTypeColor(selectedActualite.type)}`}>
                    {getTypeLabel(selectedActualite.type)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedActualite.datePublication).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="mb-2">{selectedActualite.titre}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Par {selectedActualite.auteurNom}
                </p>
              </div>
              <button
                onClick={() => setSelectedActualite(null)}
                title="Fermer"
                aria-label="Fermer l'actualité"
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedActualite.image && (
              <img
                src={selectedActualite.image}
                alt={selectedActualite.titre}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedActualite.contenu}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {selectedActualite.vues} vues
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
