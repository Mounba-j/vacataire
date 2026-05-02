import { useState, useEffect, useRef } from 'react';
import { Send, Search, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore, Conversation } from '../stores/messageStore';
import DashboardLayout from '../components/DashboardLayout';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { getConversationsByUser, getMessagesByConversation, sendMessage, markAsRead } = useMessageStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setConversations(getConversationsByUser(user.id));
    }
  }, [user, getConversationsByUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    if (user) {
      markAsRead(conv.id, user.id);
      // Refresh conversations to update unread count
      setConversations(getConversationsByUser(user.id));
    }
  };

  const handleSendMessage = () => {
    if (!user || !selectedConversation || !messageText.trim()) return;

    sendMessage({
      conversationId: selectedConversation.id,
      expediteurId: user.id,
      expediteurNom: user.name,
      expediteurAvatar: user.avatar || '',
      expediteurRole: user.role,
      contenu: messageText,
    });

    setMessageText('');
    
    // Refresh conversations
    if (user) {
      setConversations(getConversationsByUser(user.id));
      // Update selected conversation
      const updated = getConversationsByUser(user.id).find(c => c.id === selectedConversation.id);
      if (updated) setSelectedConversation(updated);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p.id !== user?.id);
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    return other?.nom.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const messages = selectedConversation
    ? getMessagesByConversation(selectedConversation.id)
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)]">
        <div className="card h-full flex flex-col md:flex-row gap-0 p-0 overflow-hidden">
          {/* Conversations List */}
          <div
            className={`w-full md:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p>Aucune conversation</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  if (!other) return null;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                        selectedConversation?.id === conv.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={other.avatar}
                          alt={other.nom}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="truncate">{other.nom}</h4>
                            {conv.messagesNonLus > 0 && (
                              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full flex-shrink-0">
                                {conv.messagesNonLus}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">
                            {other.role}
                          </p>
                          {conv.dernierMessage && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {conv.dernierMessage.expediteurId === user?.id
                                ? "Vous: "
                                : ""}
                              {conv.dernierMessage.contenu}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Messages View */}
          <div
            className={`flex-1 flex flex-col ${selectedConversation ? "flex" : "hidden md:flex"}`}
          >
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    aria-label="Retour"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {(() => {
                    const other = getOtherParticipant(selectedConversation);
                    if (!other) return null;
                    return (
                      <>
                        <img
                          src={other.avatar}
                          alt={other.nom}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="text-lg">{other.nom}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {other.role}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.expediteurId === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <img
                            src={message.expediteurAvatar}
                            alt={message.expediteurNom}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                isOwn
                                  ? "bg-[#E63946] text-white"
                                  : "bg-gray-100 dark:bg-slate-700"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {message.contenu}
                              </p>
                            </div>
                            <p
                              className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isOwn ? "text-right" : "text-left"}`}
                            >
                              {new Date(message.dateEnvoi).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <textarea
                      className="input flex-1 resize-none"
                      rows={2}
                      placeholder="Écrire un message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="btn-primary px-4 self-end disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Envoyer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">Sélectionnez une conversation</p>
                  <p className="text-sm">
                    Choisissez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
