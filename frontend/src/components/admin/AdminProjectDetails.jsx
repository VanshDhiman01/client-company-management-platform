import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  CheckSquare,
  Users,
  TrendingUp,
  MessageSquare,
  FileText,
  LifeBuoy,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Code2,
  Shield,
  Edit,
  DollarSign
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar, CircularProgress } from '../common/ProgressBar';
import { Modal } from '../common/Modal';

export const AdminProjectDetails = ({ project: propProject, onBack: propOnBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    users,
    tasks,
    projectUpdates,
    assignTicketDeveloper
  } = useApp();

  const project = propProject || projects.find(p => p.id === id) || projects[0];
  const onBack = propOnBack || (() => navigate('/admin/projects'));

  const [activeTab, setActiveTab] = useState('overview');

  const developers = users.filter((u) => u.role === 'DEVELOPER');

  // Task creation state
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDevId, setTaskDevId] = useState(developers[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskDueDate, setTaskDueDate] = useState('2026-05-30');

  useEffect(() => {
    if (!taskDevId && developers.length > 0) {
      setTaskDevId(developers[0].id);
    }
  }, [developers, taskDevId]);

  // Task Review modal state
  const [reviewTaskItem, setReviewTaskItem] = useState(null);
  const [reviewActionType, setReviewActionType] = useState('Approved');
  const [reviewNotes, setReviewNotes] = useState('');

  // Milestone update state
  const [isNewUpdateOpen, setIsNewUpdateOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  // Messages state
  const [chatInput, setChatInput] = useState('');

  const projectTicketsList = tickets.filter((t) => t.projectId === project.id);

  const activeConv = conversations.find(
    (c) => c.projectId === project.id || c.clientId === project.clientId || c.id === 'conv-1'
  ) || conversations[0];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      projectId: project.id,
      assignedDeveloperId: taskDevId,
      priority: taskPriority,
      dueDate: taskDueDate,
      initialProgress: 0
    });

    setTaskTitle('');
    setTaskDesc('');
    setIsNewTaskOpen(false);
  };

  const handleConfirmReview = () => {
    if (!reviewTaskItem) return;
    const isApproved = reviewActionType === 'Approved';
    reviewTask(
      reviewTaskItem.id,
      isApproved ? 'Approved' : 'Not Approved',
      reviewNotes || (isApproved ? 'Code review pass' : 'Revisions requested')
    );
    setReviewTaskItem(null);
    setReviewNotes('');
  };

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateMessage.trim()) return;

    postProjectUpdate({
      projectId: project.id,
      title: updateTitle.trim(),
      message: updateMessage.trim()
    });

    setUpdateTitle('');
    setUpdateMessage('');
    setIsNewUpdateOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConv) return;
    sendMessage(activeConv.id, chatInput.trim());
    setChatInput('');
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    uploadFile({
      name: uploadFileName.trim(),
      type: 'Code',
      size: '3.8 MB',
      projectId: project.id,
      isInternalOnly
    });
    setUploadFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{project.name}</h1>
              <Badge status={project.overallProgress === 100 ? 'Completed' : 'In Progress'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client: <span className="font-semibold text-slate-700">{project.companyName}</span> ({project.clientName}) • Budget: <span className="font-semibold text-slate-700">{project.budget}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewUpdateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Post Update</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1">
        {[
          { key: 'overview', label: 'Overview', icon: Layers },
          { key: 'tasks', label: `Tasks (${projectTasks.length})`, icon: CheckSquare },
          { key: 'team', label: `Dev Team (${project.assignedDeveloperIds.length})`, icon: Users },
          { key: 'updates', label: `Updates (${projectMilestones.length})`, icon: TrendingUp },
          { key: 'messages', label: 'Messages', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
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
          <div className="lg:col-span-2 space-y-6">
            {/* Scope Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Project Architecture & Specification
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {project.description}
              </p>

              {project.internalNotes && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Shield className="w-4 h-4" />
                    <span>Internal Company / PM Notes (Hidden from Client):</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-5">{project.internalNotes}</p>
                </div>
              )}
            </div>

            {/* Metadata metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-400 font-medium">Kickoff Date</span>
                <p className="text-sm font-bold text-slate-800">{project.startDate}</p>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-400 font-medium">Target Delivery</span>
                <p className="text-sm font-bold text-slate-800">{project.expectedDelivery}</p>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-400 font-medium">Contract Value</span>
                <p className="text-sm font-bold text-slate-800">{project.budget}</p>
              </div>
            </div>
          </div>

          {/* Right Progress Computation Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs text-center space-y-4">
              <h2 className="text-sm font-bold text-slate-900">
                Verified Progress Calculation
              </h2>
              <div className="flex justify-center py-2">
                <CircularProgress progress={project.overallProgress} size={130} strokeWidth={12} />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Overall Progress: <span className="text-violet-600 font-bold">{project.overallProgress}%</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                Calculated strictly as the mathematical average of all {projectTasks.length} assigned task percentage completions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Task Management & Review</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign engineering tasks, monitor milestone progress, and approve code submissions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(true)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Tasks Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Task Title</th>
                    <th className="px-6 py-3.5">Assigned Developer</th>
                    <th className="px-6 py-3.5 w-40">Progress</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Task Status</th>
                    <th className="px-6 py-3.5">Review Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{t.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{t.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200 text-[11px]">
                          {t.assignedDeveloperName || (t.assignedDeveloperId ? users.find((u) => u.id === t.assignedDeveloperId)?.name : '') || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-700">
                            <span>{t.progress}%</span>
                          </div>
                          <ProgressBar progress={t.progress} size="sm" showLabel={false} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={t.priority} variant="priority" size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={t.status} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        {t.reviewStatus === 'Approved' && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            Approved
                          </span>
                        )}
                        {(t.reviewStatus === 'Not Approved' || t.reviewStatus === 'Needs Changes') && (
                          <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                            Not Approved
                          </span>
                        )}
                        {t.reviewStatus === 'Pending Review' && (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5">
                        {t.reviewStatus === 'Approved' ? (
                          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-not-allowed inline-block">
                            Approved & Locked
                          </span>
                        ) : t.reviewStatus === 'Not Approved' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setReviewTaskItem(t);
                              setReviewActionType('Approved');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 cursor-pointer"
                          >
                            Re-Review Task
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReviewTaskItem(t);
                              setReviewActionType('Approved');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-2xs cursor-pointer"
                          >
                            PM Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Assigned Engineering Staff</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Technical resources provisioned to this project. Note: Client never sees developer profiles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {developers
              .filter((d) => project.assignedDeveloperIds.includes(d.id))
              .map((dev) => {
                const devTasks = projectTasks.filter((t) => t.assignedDeveloperId === dev.id);
                return (
                  <div
                    key={dev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dev.avatar}
                        alt={dev.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-200"
                      />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{dev.name}</h3>
                        <p className="text-[11px] text-teal-700 font-medium">{dev.email}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {devTasks.length} task(s) on this project
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      Assigned
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {/* TAB 4: UPDATES */}
      {activeTab === 'updates' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Milestone Announcements</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Public progress reports broadcasted to the client portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewUpdateOpen(true)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Update</span>
            </button>
          </div>

          <div className="space-y-4">
            {projectMilestones.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{m.title}</h3>
                  <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{m.message}</p>
                <p className="text-[10px] text-slate-400">Published by {m.authorName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Official Communication Channel with {project.companyName}
              </h2>
              <p className="text-[11px] text-slate-500">
                Client communicates directly with Company PM
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderRole === 'ADMIN';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderName} ({msg.senderRole}) • {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-violet-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Reply to client as Orange Mantra – Interview Project Team..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      )}



      {/* Modal: Create Task */}
      <Modal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Add Engineering Task"
        subtitle={`Provision a task for ${project.name} and assign to a developer.`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Developer *
              </label>
              <select
                value={taskDevId}
                onChange={(e) => setTaskDevId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                {developers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Level
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Description & Technical Specifications
            </label>
            <textarea
              rows={3}
              placeholder="Specify requirements, acceptance criteria, and schema requirements..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Review Task (Approve or Send Back) */}
      {reviewTaskItem && (
        <Modal
          isOpen={!!reviewTaskItem}
          onClose={() => setReviewTaskItem(null)}
          title={`Review Task: ${reviewTaskItem.title}`}
          subtitle={`Assigned Developer: ${reviewTaskItem.assignedDeveloperName} • Current Progress: ${reviewTaskItem.progress}%`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {reviewTaskItem.reviewStatus === 'Approved' ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                This task has been Approved and the review decision is permanently locked.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Manager Decision
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewActionType('Approved')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        reviewActionType === 'Approved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewActionType('Not Approved')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        reviewActionType === 'Not Approved'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Not Approved</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Review Feedback / QA Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add review comments for the developer..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewTaskItem(null)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReview}
                    className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md cursor-pointer"
                  >
                    Submit Decision
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Post Milestone Update */}
      {isNewUpdateOpen && (
        <Modal
          isOpen={isNewUpdateOpen}
          onClose={() => setIsNewUpdateOpen(false)}
          title="Post Project Milestone Update"
          subtitle="This announcement will be published directly to the client's portal."
          maxWidth="md"
        >
          <form onSubmit={handlePostUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Update Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Staging QA Verified; Finalizing Deployment"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Message *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Explain the milestone achievements, current testing status, and next deliverables..."
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewUpdateOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                Publish to Client
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
