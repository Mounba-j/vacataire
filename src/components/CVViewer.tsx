import { useState } from 'react';
import { X, Download, Mail, Phone, MapPin, Calendar, Award, Briefcase, Star, Languages, MessageSquare } from 'lucide-react';
import { CVEnseignant } from '../stores/cvStore';
import ContactEnseignantModal from './ContactEnseignantModal';

interface CVViewerProps {
  cv: CVEnseignant;
  onClose: () => void;
}

export default function CVViewer({ cv, onClose }: CVViewerProps) {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleDownloadCV = () => {
    // Simulate CV download
    alert('Téléchargement du CV en cours...');
    // TODO: Implement actual download
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h2>Curriculum Vitae</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header with Photo */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <img
              src={cv.enseignantAvatar}
              alt={cv.enseignantNom}
              className="w-32 h-32 rounded-full border-4 border-blue-100 dark:border-blue-900 object-cover mx-auto md:mx-0"
            />
            <div className="flex-1">
              <h2 className="mb-2">{cv.enseignantNom}</h2>
              <p className="text-xl text-[#E63946] font-medium mb-4">{cv.matiere}</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  {cv.enseignantEmail}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  {cv.telephone}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  {cv.ville}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {cv.experience} d'expérience
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleDownloadCV}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le CV
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contacter
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          {cv.bio && (
            <div className="mb-8">
              <h3 className="mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#E63946]" />
                Présentation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{cv.bio}</p>
            </div>
          )}

          {/* Diplômes */}
          <div className="mb-8">
            <h3 className="mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E63946]" />
              Formation
            </h3>
            <div className="space-y-2">
              {cv.diplomes.map((diplome, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-[#E63946] mt-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{diplome}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expériences */}
          <div className="mb-8">
            <h3 className="mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#E63946]" />
              Expérience Professionnelle
            </h3>
            <div className="space-y-4">
              {cv.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <h4 className="mb-1">{exp.poste}</h4>
                  <p className="text-sm text-[#E63946] mb-2">
                    {exp.etablissement} • {exp.periode}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compétences */}
          <div className="mb-8">
            <h3 className="mb-3">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {cv.competences.map((comp, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Langues */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#E63946]" />
              Langues
            </h3>
            <div className="flex flex-wrap gap-2">
              {cv.langues.map((langue, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                >
                  {langue}
                </span>
              ))}
            </div>
          </div>

          {/* Tarif et Disponibilité */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Tarif horaire
              </p>
              <p className="text-2xl font-semibold text-[#E63946]">{cv.tarif}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Disponibilité
              </p>
              <span
                className={`badge ${
                  cv.disponible ? 'badge-success' : 'badge-error'
                }`}
              >
                {cv.disponible ? 'Disponible' : 'Indisponible'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactEnseignantModal
          enseignant={{
            id: cv.enseignantId,
            nom: cv.enseignantNom,
            email: cv.enseignantEmail,
            avatar: cv.enseignantAvatar,
            matiere: cv.matiere,
          }}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </>
  );
}
