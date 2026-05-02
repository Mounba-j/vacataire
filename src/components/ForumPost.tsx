import { useState } from 'react';
import { Heart, MessageCircle, Send, Trash2, Tag } from 'lucide-react';
import { ForumPost as ForumPostType, useForumStore } from '../stores/forumStore';
import { useAuthStore } from '../stores/authStore';

interface ForumPostProps {
  post: ForumPostType;
}

export default function ForumPost({ post }: ForumPostProps) {
  const { user } = useAuthStore();
  const { toggleLikePost, toggleLikeReponse, addReponse, deletePost, deleteReponse } = useForumStore();
  const [showReponses, setShowReponses] = useState(false);
  const [reponseText, setReponseText] = useState('');

  const isLikedByUser = user ? post.likedBy.includes(user.id) : false;

  const handleLikePost = () => {
    if (user) {
      toggleLikePost(post.id, user.id);
    }
  };

  const handleLikeReponse = (reponseId: number) => {
    if (user) {
      toggleLikeReponse(post.id, reponseId, user.id);
    }
  };

  const handleAddReponse = () => {
    if (!user || !reponseText.trim()) return;

    addReponse(post.id, {
      auteurId: user.id,
      auteurNom: user.name,
      auteurRole: user.role as 'enseignant' | 'ecole',
      auteurAvatar: user.avatar || '',
      contenu: reponseText,
    });

    setReponseText('');
  };

  const handleDeletePost = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      deletePost(post.id);
    }
  };

  const handleDeleteReponse = (reponseId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      deleteReponse(post.id, reponseId);
    }
  };

  return (
    <div className="card">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={post.auteurAvatar}
          alt={post.auteurNom}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="mb-1">{post.auteurNom}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.auteurRole === "enseignant" ? "Enseignant" : "École"} •{" "}
                {new Date(post.datePublication).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {user && user.id === post.auteurId && (
              <button
                onClick={handleDeletePost}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                aria-label="Supprimer le post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="mb-2">{post.titre}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {post.contenu}
        </p>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLikePost}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isLikedByUser
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "hover:bg-gray-100 dark:hover:bg-slate-700"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLikedByUser ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">{post.likes}</span>
        </button>

        <button
          onClick={() => setShowReponses(!showReponses)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.reponses.length}</span>
        </button>
      </div>

      {/* Réponses */}
      {showReponses && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Liste des réponses */}
          {post.reponses.map((reponse) => {
            const isReponselikedByUser = user
              ? reponse.likedBy.includes(user.id)
              : false;

            return (
              <div key={reponse.id} className="flex gap-3">
                <img
                  src={reponse.auteurAvatar}
                  alt={reponse.auteurNom}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-medium mb-1">
                        {reponse.auteurNom}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {reponse.auteurRole === "enseignant"
                          ? "Enseignant"
                          : "École"}{" "}
                        •{" "}
                        {new Date(reponse.datePublication).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                    {user && user.id === reponse.auteurId && (
                      <button
                        onClick={() => handleDeleteReponse(reponse.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400"
                        aria-label="Supprimer la réponse"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {reponse.contenu}
                  </p>
                  <button
                    onClick={() => handleLikeReponse(reponse.id)}
                    className={`flex items-center gap-1 text-xs ${
                      isReponselikedByUser
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isReponselikedByUser ? "fill-current" : ""}`}
                    />
                    {reponse.likes > 0 && <span>{reponse.likes}</span>}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Formulaire de réponse */}
          <div className="flex gap-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Écrire une réponse..."
                value={reponseText}
                onChange={(e) => setReponseText(e.target.value)}
              />
              <button
                onClick={handleAddReponse}
                disabled={!reponseText.trim()}
                className="mt-2 btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Répondre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
