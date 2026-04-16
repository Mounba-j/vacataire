import { useState } from 'react';
import { X, Send, Mail, User, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { useNavigate } from 'react-router-dom';

interface ContactEnseignantModalProps {
  enseignant: {
    id: number;
    nom: string;
    email: string;
    avatar: string;
    matiere: string;
  };
  onClose: () => void;
}

export default function ContactEnseignantModal({ enseignant, onClose }: ContactEnseignantModalProps) {
  const { user } = useAuthStore();
  const { getOrCreateConversation, sendMessage } = useMessageStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    objet: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim() || !user) return;

    setIsSending(true);

    // Create or get conversation
    const conversationId = getOrCreateConversation(
      user.id,
      enseignant.id,
      {
        nom: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      {
        nom: enseignant.nom,
        avatar: enseignant.avatar,
        role: 'enseignant',
      }
    );

    // Send message
    const messageContent = formData.objet 
      ? `**${formData.objet}**\n\n${formData.message}`
      : formData.message;

    sendMessage({
      conversationId,
      expediteurId: user.id,
      expediteurNom: user.name,
      expediteurAvatar: user.avatar || '',
      expediteurRole: user.role,
      contenu: messageContent,
    });

    setIsSending(false);
    onClose();
    
    // Navigate to messages page
    setTimeout(() => {
      navigate('/messages');
    }, 100);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      <div
        className="card max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2>Contacter {enseignant.nom}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enseignant Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg mb-6">
          <img
            src={enseignant.avatar}
            alt={enseignant.nom}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h4 className="mb-1">{enseignant.nom}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {enseignant.matiere}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500 mt-1">
              <Mail className="w-3 h-3" />
              {enseignant.email}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="w-4 h-4 inline mr-1" />
              De la part de
            </label>
            <input
              type="text"
              className="input"
              value={user?.name || ''}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Objet (optionnel)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Demande de renseignements"
              value={formData.objet}
              onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Message *
            </label>
            <textarea
              className="input"
              rows={6}
              placeholder="Écrivez votre message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.message.length}/1000 caractères
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Votre message sera envoyé dans votre boîte de messagerie privée. 
              Vous pourrez continuer la conversation dans la section "Messages".
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isSending || !formData.message.trim()}
            >
              <Send className="w-5 h-5" />
              {isSending ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}