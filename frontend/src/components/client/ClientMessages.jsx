import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Building2,
  CheckCheck,
  Smile,
  MoreVertical,
  Clock,
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

export const ClientMessages = () => {
  const { currentUser, users } = useApp();
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch real ADMIN users from PostgreSQL DB
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setIsLoading(true);
        const res = await messageService.getUsersByRole('ADMIN');
        if (res && res.success && Array.isArray(res.users) && res.users.length > 0) {
          setAdmins(res.users);
          setSelectedAdminId(res.users[0].id);
        } else {
          const adminUsers = (users || []).filter((u) => u.role === 'ADMIN');
          setAdmins(adminUsers);
          if (adminUsers.length > 0) setSelectedAdminId(adminUsers[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch admins via /api/messages/users/ADMIN, using context users:', err.message);
        const adminUsers = (users || []).filter((u) => u.role === 'ADMIN');
        setAdmins(adminUsers);
        if (adminUsers.length > 0) setSelectedAdminId(adminUsers[0].id);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, [users]);

  // 2. Load or create conversation with selected Admin
  useEffect(() => {
    if (!selectedAdminId) return;

    const loadConv = async () => {
      try {
        const res = await messageService.getOrCreateConversation(selectedAdminId);
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
  }, [selectedAdminId]);

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

  const handleQuickQuestion = (text) => {
    setMessageText(text);
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Messages & Support Line</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Direct communication line with your assigned technical project management and leadership team.
        </p>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden h-[620px] flex flex-col md:flex-row">
        {/* Left: Conversations sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search managers..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading PM team...</div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No managers found</div>
            ) : (
              filteredAdmins.map((admin) => {
                const isSelected = selectedAdminId === admin.id;
                return (
                  <div
                    key={admin.id}
                    onClick={() => setSelectedAdminId(admin.id)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {admin.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-indigo-600 font-medium truncate mt-0.5">
                        {admin.title || 'Project Manager'}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5 leading-relaxed">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Orange Mantra – Interview Project
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      Active SLA
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct channel for {currentUser.companyName || 'Your Organization'} • Managed by Technical PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Avg response: &lt; 15 mins</span>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              <div className="text-center my-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[11px] font-medium">
                  End-to-End Encrypted Client Channel
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No messages yet. Send a message to start real-time chat.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderRole === 'CLIENT';
                  const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formattedTime}
                        </span>
                      </div>
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        {msg.attachmentUrl && (
                          <div className="mb-2">
                            {msg.attachmentType?.startsWith('image/') ? (
                              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                <img src={msg.attachmentUrl} alt="Attachment" className="max-w-full rounded-lg max-h-48 object-cover" />
                              </a>
                            ) : (
                              <div className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-indigo-700' : 'bg-slate-100'} border ${isMe ? 'border-indigo-500' : 'border-slate-200'}`}>
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



            {/* Message Input Bar */}
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
                  className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                  title="Attach specification or screenshot"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
  
                <input
                  type="text"
                  placeholder="Type your message to the company project management team..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
  
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            Select a manager to begin messaging
          </div>
        )}
      </div>
    </div>
  );
};
