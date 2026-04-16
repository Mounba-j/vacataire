import { useState } from 'react';
import { Plus, Search, Clock, TrendingUp, MessageSquare, X, Heart, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useForumStore } from '../stores/forumStore';
import DashboardLayout from '../components/DashboardLayout';
import ForumPost from '../components/ForumPost';

export default function ForumPage() {
  const { user } = useAuthStore();
  const { posts, addPost } = useForumStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [newPost, setNewPost] = useState({
    titre: '',
    contenu: '',
    tags: '',
  });

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  // Filter posts based on search and selected tag
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.auteurNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') {
      // Sort by likes first, then by engagement (likes + replies)
      const engagementA = a.likes + a.reponses.length;
      const engagementB = b.likes + b.reponses.length;
      if (engagementB !== engagementA) {
        return engagementB - engagementA;
      }
      // If engagement is equal, sort by date
      return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
    }
    // Sort by date (most recent first)
    return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
  });

  const handleCreatePost = () => {
    if (!user || !newPost.titre.trim() || !newPost.contenu.trim()) return;

    const tags = newPost.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    addPost({
      auteurId: user.id,
      auteurNom: user.name,
      auteurRole: user.role as 'enseignant' | 'ecole',
      auteurAvatar: user.avatar || '',
      titre: newPost.titre,
      contenu: newPost.contenu,
      tags: tags.length > 0 ? tags : undefined,
    });

    setNewPost({ titre: '', contenu: '', tags: '' });
    setShowNewPostModal(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="mb-2">Forum Professionnel</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Espace d'échange entre enseignants et établissements
            </p>
          </div>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans le forum..."
                className="input w-full" style={{ paddingLeft: '2.5rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Trier par
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                      sortBy === 'recent'
                        ? 'bg-[#E63946] text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Récents
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                      sortBy === 'popular'
                        ? 'bg-[#E63946] text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Populaires
                  </button>
                </div>
              </div>

              {/* Sort info */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Résultats
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-lg">
                  {sortBy === 'recent' ? (
                    <>📅 Triés par date • {sortedPosts.length} post{sortedPosts.length > 1 ? 's' : ''}</>
                  ) : (
                    <>⭐ Triés par engagement • {sortedPosts.length} post{sortedPosts.length > 1 ? 's' : ''}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-semibold text-[#E63946] mb-1">
              {posts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Posts publiés
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-semibold text-[#E63946] mb-1">
              {posts.reduce((acc, post) => acc + post.reponses.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Réponses totales
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-semibold text-[#E63946] mb-1">
              {posts.reduce((acc, post) => acc + post.likes, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Likes totaux
            </div>
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="card">
            <h3 className="mb-4 text-sm font-semibold">Filtrer par tags</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === null
                    ? 'bg-[#E63946] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Tous les tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#E63946] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h4 className="mb-2">Aucun post trouvé</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery
                  ? 'Essayez de modifier votre recherche'
                  : 'Soyez le premier à créer un post!'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Créer un post
                </button>
              )}
            </div>
          ) : (
            sortedPosts.map((post, index) => (
              <div key={post.id} className="relative">
                {/* Badge for top posts */}
                {sortBy === 'popular' && index === 0 && (
                  <div className="absolute -top-3 -left-3 z-10">
                    <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      🔥 Tendance
                    </span>
                  </div>
                )}
                {sortBy === 'recent' && index === 0 && (
                  <div className="absolute -top-3 -left-3 z-10">
                    <span className="inline-flex items-center gap-1 bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ✨ Nouveau
                    </span>
                  </div>
                )}
                
                {/* Post Card with Stats */}
                <div className="card hover:shadow-lg transition-all">
                  <ForumPost post={post} />
                  
                  {/* Post Stats Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes} like{post.likes > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.reponses.length} réponse{post.reponses.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span>
                      {new Date(post.datePublication).toLocaleDateString('fr-FR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowNewPostModal(false)}
        >
          <div
            className="card max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2>Créer un nouveau post</h2>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Question sur les classes de Terminale"
                  value={newPost.titre}
                  onChange={(e) => setNewPost({ ...newPost, titre: e.target.value })}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {newPost.titre.length}/100 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenu *</label>
                <textarea
                  className="input"
                  rows={6}
                  placeholder="Décrivez votre question ou partagez vos informations..."
                  value={newPost.contenu}
                  onChange={(e) => setNewPost({ ...newPost, contenu: e.target.value })}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {newPost.contenu.length}/1000 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags (optionnel)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: mathématiques, terminale, conseils (séparés par des virgules)"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Séparez les tags par des virgules
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.titre.trim() || !newPost.contenu.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
