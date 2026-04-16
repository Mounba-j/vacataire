import { useState, useRef } from 'react';
import { Camera, Upload, X, Trash2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface ProfilePhotoUploaderProps {
  onClose: () => void;
}

export default function ProfilePhotoUploader({ onClose }: ProfilePhotoUploaderProps) {
  const { user, updateUserAvatar } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format non supporté. Veuillez télécharger une image JPG, PNG ou WebP.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop volumineuse. Taille maximale: 5 MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Update user avatar in authStore
          updateUserAvatar(selectedImage);
          
          alert('Photo de profil mise à jour avec succès!');
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // TODO: Implement actual file upload to backend
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`;
      setPreviewImage(defaultAvatar);
      setSelectedImage(defaultAvatar);
      updateUserAvatar(defaultAvatar);
    }
  };

  const handleGenerateAvatar = () => {
    const seed = user?.name || 'user';
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}-${Date.now()}`;
    setPreviewImage(newAvatar);
    setSelectedImage(newAvatar);
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
          <h2>Photo de profil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={previewImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt="Profile preview"
              className="w-40 h-40 rounded-full border-4 border-blue-100 dark:border-blue-900 object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            {user?.name}
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6 space-y-2">
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
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#0056D2] transition-colors"
            disabled={isUploading}
          >
            <Upload className="w-5 h-5" />
            Télécharger une photo
          </button>

          <button
            onClick={handleGenerateAvatar}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            disabled={isUploading}
          >
            <RefreshCw className="w-5 h-5" />
            Générer un avatar aléatoire
          </button>

          {selectedImage && (
            <button
              onClick={handleUpload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium"
              disabled={isUploading}
            >
              <Camera className="w-5 h-5" />
              Enregistrer cette photo
            </button>
          )}

          {previewImage && (
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              disabled={isUploading}
            >
              <Trash2 className="w-5 h-5" />
              Supprimer la photo
            </button>
          )}
        </div>

        {/* Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            📸 Conseils pour une bonne photo
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Utilisez une photo récente et professionnelle</li>
            <li>Assurez-vous que votre visage est bien visible</li>
            <li>Évitez les photos de groupe</li>
            <li>Formats acceptés: JPG, PNG, WebP (max. 5 MB)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}