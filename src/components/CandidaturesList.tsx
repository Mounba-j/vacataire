import { useState } from 'react';
import { Check, X, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { useOffreStore, Candidature } from '../stores/offreStore';

interface CandidaturesListProps {
  offreId: number;
  offreTitre: string;
  onClose: () => void;
}

export default function CandidaturesList({ offreId, offreTitre, onClose }: CandidaturesListProps) {
  const { getCandidaturesByOffre, updateCandidature } = useOffreStore();
  const [candidatures, setCandidatures] = useState<Candidature[]>(getCandidaturesByOffre(offreId));
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);

  const handleUpdateStatut = (candidatureId: number, statut: Candidature['statut']) => {
    updateCandidature(candidatureId, statut);
    setCandidatures(getCandidaturesByOffre(offreId));
    setSelectedCandidature(null);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'acceptee':
        return 'badge-success';
      case 'refusee':
        return 'badge-error';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'acceptee':
        return 'Acceptée';
      case 'refusee':
        return 'Refusée';
      default:
        return 'En attente';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="mb-2">Candidatures reçues</h2>
            <p className="text-gray-600 dark:text-gray-300">{offreTitre}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {candidatures.length} candidature
              {candidatures.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {candidatures.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h4 className="mb-2">Aucune candidature</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Vous n'avez pas encore reçu de candidatures pour cette offre.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidatures.map((candidature) => (
              <div
                key={candidature.id}
                className="card border-2 hover:border-[#E63946] transition-all cursor-pointer"
                onClick={() => setSelectedCandidature(candidature)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{candidature.enseignantNom}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidature.enseignantEmail}
                        </p>
                      </div>
                      <span
                        className={`badge ${getStatutColor(candidature.statut)}`}
                      >
                        {getStatutLabel(candidature.statut)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {candidature.motivation}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      Postulé le{" "}
                      {new Date(candidature.datePostulation).toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidature(candidature);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Détail Candidature */}
        {selectedCandidature && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCandidature(null)}
          >
            <div
              className="card max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="mb-2">{selectedCandidature.enseignantNom}</h3>
                  <span
                    className={`badge ${getStatutColor(selectedCandidature.statut)}`}
                  >
                    {getStatutLabel(selectedCandidature.statut)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCandidature(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${selectedCandidature.enseignantEmail}`}
                        className="hover:text-[#E63946]"
                      >
                        {selectedCandidature.enseignantEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span>+33 6 12 34 56 78</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2">Date de postulation</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(
                      selectedCandidature.datePostulation,
                    ).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2">Lettre de motivation</h4>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedCandidature.motivation}
                  </p>
                </div>

                {selectedCandidature.statut === "en_attente" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() =>
                        handleUpdateStatut(selectedCandidature.id, "refusee")
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                    >
                      <X className="w-5 h-5" />
                      Refuser
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatut(selectedCandidature.id, "acceptee")
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium"
                    >
                      <Check className="w-5 h-5" />
                      Accepter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
