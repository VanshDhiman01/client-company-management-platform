import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  LifeBuoy,
  Layers,
  Upload,
  Send,
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar, CircularProgress } from '../common/ProgressBar';

export const ClientProjectDetails = ({ project: propProject, onBack: propOnBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    projects,
    projectUpdates,
    conversations,
    sendMessage,
    messages
  } = useApp();

  const project = propProject || projects.find(p => p.id === id) || projects[0];
  const onBack = propOnBack || (() => navigate('/client/projects'));

  const [activeTab, setActiveTab] = useState('overview');

  // Chat message state inside project
  const [chatInput, setChatInput] = useState('');

  // Updates for this project
  const updates = projectUpdates.filter((u) => u.projectId === project.id);

  // Conversation for this client
  const clientConv = conversations.find(
    (c) => c.clientId === currentUser.id || c.projectId === project.id || c.id === 'conv-1'
  ) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !clientConv) return;
    sendMessage(clientConv.id, chatInput.trim());
    setChatInput('');
  };



  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    uploadFile({
      name: uploadFileName.trim(),
      type: 'Document',
      size: '1.5 MB',
      projectId: project.id,
      isInternalOnly: false
    });
    setUploadFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {project.name}
              </h1>
              <Badge status={project.overallProgress === 100 ? 'Completed' : 'In Progress'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Category: <span className="font-semibold text-slate-700">{project.category}</span> • Start Date: {project.startDate} • Expected Delivery: {project.expectedDelivery}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1">
        {[
          { key: 'overview', label: 'Overview', icon: Layers },
          { key: 'updates', label: `Updates (${updates.length})`, icon: TrendingUp },
          { key: 'messages', label: 'Messages', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description & Scope */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Project Scope & Deliverables
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {project.description}
              </p>

              {project.clientVisibleNotes && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
                  <span className="font-semibold block mb-1">Company Executive Note:</span>
                  <p className="text-slate-700 leading-relaxed">{project.clientVisibleNotes}</p>
                </div>
              )}
            </div>

            {/* Key Project Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Project Kickoff</span>
                  <p className="text-sm font-bold text-slate-800">{project.startDate}</p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Target Delivery Date</span>
                  <p className="text-sm font-bold text-slate-800">{project.expectedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Latest Official Update Banner */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Latest Company Status Report</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
                "{typeof project.latestUpdate === 'object' && project.latestUpdate ? project.latestUpdate.summary || JSON.stringify(project.latestUpdate) : project.latestUpdate}"
              </p>
            </div>
          </div>

          {/* Right: Large Overall Progress Display */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs text-center space-y-5">
              <h2 className="text-sm font-bold text-slate-900">
                Overall Project Progress
              </h2>

              <div className="flex justify-center py-2">
                <CircularProgress progress={project.overallProgress} size={130} strokeWidth={12} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 px-2 font-medium">
                  <span>Current Phase</span>
                  <span className="font-semibold text-slate-900">{project.status}</span>
                </div>
                <ProgressBar progress={project.overallProgress} size="md" showLabel={false} />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Progress represents the verified completion of all engineering and quality-assurance milestones by your project manager.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPDATES */}
      {activeTab === 'updates' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Project Milestone Log</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological progress releases published by your dedicated Project Manager.
            </p>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
            {updates.length === 0 ? (
              <p className="text-xs text-slate-400 py-6">No milestone updates posted yet.</p>
            ) : (
              updates.map((upd) => (
                <div key={upd.id} className="relative pl-8 space-y-1.5">
                  <div className="absolute left-2 top-1.5 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{upd.title}</h3>
                    <span className="text-[11px] text-slate-400">{upd.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    {upd.message}
                  </p>
                  <p className="text-[10px] text-slate-400">Published by {upd.authorName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Direct Communication Channel
              </h2>
              <p className="text-[11px] text-slate-500">
                Live line with Orange Mantra – Interview Project Team
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Company Team Online
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {clientConv.messages.map((msg) => {
              const isMe = msg.senderRole === 'CLIENT';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderName} • {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question or request a requirement change..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}



    </div>
  );
};
