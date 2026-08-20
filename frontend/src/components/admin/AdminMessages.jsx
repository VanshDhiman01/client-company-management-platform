import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Building2,
  Paperclip,
  CheckCheck,
  User,
  X,
  FileText,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { messageService } from '../../services/messageService';
import {
  joinConversation,
  leaveConversation,
  subscribeToNewMessages,
  unsubscribeFromNewMessages
} from '../../services/socketService';

export const AdminMessages = () => {
  const { currentUser, users } = useApp();
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch real CLIENT users from PostgreSQL DB
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const res = await messageService.getUsersByRole('CLIENT');
        if (res && res.success && Array.isArray(res.users) && res.users.length > 0) {
          setClients(res.users);
          setSelectedClientId(res.users[0].id);
        } else {
          const clientUsers = (users || []).filter((u) => u.role === 'CLIENT');
          setClients(clientUsers);
          if (clientUsers.length > 0) setSelectedClientId(clientUsers[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch clients via /api/messages/users/CLIENT, using context users:', err.message);
        const clientUsers = (users || []).filter((u) => u.role === 'CLIENT');
        setClients(clientUsers);
        if (clientUsers.length > 0) setSelectedClientId(clientUsers[0].id);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [users]);

  // 2. Load or create conversation with selected Client
  useEffect(() => {
    if (!selectedClientId) return;

    const loadConv = async () => {
      try {
        const res = await messageService.getOrCreateConversation(selectedClientId);
        if (res && res.success && res.conversation) {
          setActiveConv(res.conversation);
          setMessages(res.conversation.messages || []);
          joinConversation(res.conversation.id);
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
      }
    };

    loadConv();

    return () => {
      if (activeConv?.id) {
        leaveConversation(activeConv.id);
      }
    };
  }, [selectedClientId]);

  // 3. Listen to real-time Socket.IO new messages
  useEffect(() => {
    subscribeToNewMessages((newMsg) => {
      if (activeConv && newMsg.conversationId === activeConv.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    return () => {
      unsubscribeFromNewMessages();
    };
  }, [activeConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!messageText.trim() && !attachmentFile) || !activeConv) return;

    const textToSend = messageText.trim();
    const fileToSend = attachmentFile;
    
    setMessageText('');
    setAttachmentFile(null);

    try {
      let res;
      if (fileToSend) {
        res = await messageService.sendMessageWithAttachment(activeConv.id, textToSend, fileToSend);
      } else {
        res = await messageService.sendMessage(activeConv.id, textToSend);
      }
      
      if (res && res.success && res.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.message.id)) return prev;
          return [...prev, res.message];
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(localSearch.toLowerCase())) ||
      c.email.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Client Communications Center</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Centralized executive and technical PM communication channels with client organizations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden h-[620px] flex flex-col md:flex-row">
        {/* Left: Client channels */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading client users...</div>
            ) : filteredClients.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No client users found</div>
            ) : (
              filteredClients.map((client) => {
                const isSelected = selectedClientId === client.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-violet-50/80 border-l-4 border-violet-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {client.companyName || client.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-violet-700 font-medium truncate mt-0.5">
                        Client: {client.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {client.email}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeConv.companyName} ({activeConv.clientName})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Project Channel: {activeConv.projectName || 'General Organization Thread'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No messages yet. Send a message to start real-time chat.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderRole === 'ADMIN';
                  const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-1 px-1">
                        {msg.senderName} ({msg.senderRole}) • {formattedTime}
                      </span>
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-violet-600 text-white rounded-tr-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        {msg.attachmentUrl && (
                          <div className="mb-2">
                            {msg.attachmentType?.startsWith('image/') ? (
                              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                <img src={msg.attachmentUrl} alt="Attachment" className="max-w-full rounded-lg max-h-48 object-cover" />
                              </a>
                            ) : (
                              <div className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-violet-700' : 'bg-slate-100'} border ${isMe ? 'border-violet-500' : 'border-slate-200'}`}>
                                <FileText className="w-5 h-5 shrink-0" />
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <p className="truncate font-medium">{msg.attachmentName}</p>
                                  <p className="text-[10px] opacity-80">{msg.attachmentSize}</p>
                                </div>
                                <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1.5 rounded-full hover:bg-black/10">
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        {msg.text && <div>{msg.text}</div>}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-slate-200 flex flex-col">
              {attachmentFile && (
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate max-w-xs">{attachmentFile.name}</span>
                  </div>
                  <button type="button" onClick={() => setAttachmentFile(null)} className="text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="p-4 flex items-center gap-3">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => setAttachmentFile(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type response as Lead Project Manager..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            Select a client conversation to begin messaging
          </div>
        )}
      </div>
    </div>
  );
};
