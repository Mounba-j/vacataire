import { useState } from 'react';
import { Trash2, Eye, AlertTriangle } from 'lucide-react';
import { useForumStore } from '../stores/forumStore';

export default function AdminForumModeration() {
  const { posts, deletePost, deleteReponse } = useForumStore();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.')) {
      deletePost(postId);
      setSelectedPost(null);
      alert('Post supprimé avec succès');
    }
  };

  const handleDeleteReponse = (postId: number, reponseId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      deleteReponse(postId, reponseId);
      // Refresh selected post
      const updated = posts.find(p => p.id === postId);
      if (updated) setSelectedPost(updated);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <p className="text-sm text-orange-800 dark:text-orange-300">
            En tant qu'administrateur, vous pouvez modérer tous les posts et
            réponses du forum.
          </p>
        </div>

        <div className="card">
          <h3 className="mb-4">Posts du forum ({posts.length})</h3>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#E63946] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="mb-1">{post.titre}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>Par {post.auteurNom}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.datePublication).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                      <span>•</span>
                      <span>{post.likes} likes</span>
                      <span>•</span>
                      <span>{post.reponses.length} réponses</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-600"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {post.contenu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2>Modération du post</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Post Content */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={selectedPost.auteurAvatar}
                    alt={selectedPost.auteurNom}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h4>{selectedPost.auteurNom}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(
                        selectedPost.datePublication,
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <h3 className="mb-2">{selectedPost.titre}</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedPost.contenu}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{selectedPost.likes} likes</span>
                  <span>{selectedPost.reponses.length} réponses</span>
                </div>
              </div>

              {/* Réponses */}
              {selectedPost.reponses.length > 0 && (
                <div>
                  <h4 className="mb-3">
                    Réponses ({selectedPost.reponses.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedPost.reponses.map((reponse: any) => (
                      <div
                        key={reponse.id}
                        className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={reponse.auteurAvatar}
                              alt={reponse.auteurNom}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {reponse.auteurNom}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(
                                  reponse.datePublication,
                                ).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteReponse(selectedPost.id, reponse.id)
                            }
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600"
                            aria-label="Supprimer la réponse"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {reponse.contenu}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn-secondary flex-1"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer le post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
