import { useState, useRef } from 'react';
import { Upload, File, X, Download, Trash2, CheckCircle } from 'lucide-react';

interface CVUploaderProps {
  onClose: () => void;
}

export default function CVUploader({ onClose }: CVUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentCV, setCurrentCV] = useState<string | null>('CV_Marie_Dupont.pdf'); // Mock existing CV
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format non supporté. Veuillez télécharger un fichier PDF ou Word.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 5 MB.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setCurrentCV(selectedFile.name);
          setSelectedFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // TODO: Implement actual file upload to backend
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) {
      setCurrentCV(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="card max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2>Mon CV</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current CV */}
        {currentCV && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                    CV actuel
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {currentCV}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#E63946] transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h4 className="mb-2">Télécharger un nouveau CV</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Glissez-déposez votre fichier ou cliquez pour parcourir
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Formats acceptés: PDF, DOC, DOCX (max. 5 MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-8 h-8 text-[#E63946] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm truncate">{selectedFile.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Supprimer le fichier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Téléchargement en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#E63946] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="btn-secondary flex-1">
              Fermer
            </button>
            {selectedFile && !isUploading && (
              <button onClick={handleUpload} className="btn-primary flex-1">
                Télécharger
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            💡 Conseils pour un CV efficace
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Mettez en avant votre expérience pédagogique</li>
            <li>Incluez vos diplômes et certifications</li>
            <li>Mentionnez vos spécialités et niveaux enseignés</li>
            <li>Gardez un format clair et professionnel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
