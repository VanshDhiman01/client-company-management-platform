import React, { useState } from 'react';
import {
  Users,
  FilePlus2,
  FolderKanban,
  CheckCircle2,
  LifeBuoy,
  Code2,
  ArrowUpRight,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const AdminDashboard = () => {
  const {
    currentUser,
    users,
    projects,
    projectRequests,
    tasks,
    conversations,
    setSelectedDetailId,
    reviewProjectRequest,
    acceptAndCreateProjectWorkflow,
    searchQuery,
    updateUserRole
  } = useApp();

  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.role === newRole) return;

    setUpdatingUserId(targetUser.id);
    setStatusMessage(null);

    try {
      await updateUserRole(targetUser.id, newRole);
      setStatusMessage({
        type: 'success',
        text: `Successfully updated ${targetUser.name}'s role to ${newRole}.`
      });
      
      // If the admin changed their own role, refresh the page to route them to their new dashboard
      if (targetUser.id === currentUser?.id) {
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update user role.'
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const navigate = useNavigate();

  const clientCount = users.filter((u) => u.role === 'CLIENT').length;
  const devCount = users.filter((u) => u.role === 'DEVELOPER').length;
  const pendingRequests = projectRequests.filter((r) => r.status === 'Pending');
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning');
  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const openTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCountAdmin, 0);
  const pendingTaskReviews = tasks.filter((t) => t.progress === 100 && t.reviewStatus === 'Pending Review');

  const filteredProjects = projects.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Admin & Project Manager Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-200">
              Full System Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage client portfolios, allocate engineering tasks, and govern project delivery pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Engineering Task</span>
          </button>
        </div>
      </div>

      {/* Pending Reviews Alert Banner */}
      {pendingTaskReviews.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {pendingTaskReviews.length} Task(s) Ready for Project Manager Review
              </p>
              <p className="text-[11px] text-amber-700">
                Developers have submitted 100% completion on deliverables awaiting QA approval.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            Review Tasks
          </button>
        </div>
      )}

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div
          onClick={() => { setSelectedDetailId(null); navigate('/admin/clients'); }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <span className="text-[11px] font-medium text-slate-500 block">Total Clients</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{clientCount}</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        <div
          onClick={() => { setSelectedDetailId(null); navigate('/admin/requests'); }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <span className="text-[11px] font-medium text-slate-500 block">Pending Requests</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{pendingRequests.length}</span>
            <FilePlus2 className="w-4 h-4 text-amber-600" />
          </div>
        </div>

        <div
          onClick={() => { setSelectedDetailId(null); navigate('/admin/projects'); }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <span className="text-[11px] font-medium text-slate-500 block">Active Projects</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">{activeProjects.length}</span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div
          onClick={() => { setSelectedDetailId(null); navigate('/admin/projects'); }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <span className="text-[11px] font-medium text-slate-500 block">Completed Projects</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{completedProjects.length}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>


        <div
          onClick={() => { setSelectedDetailId(null); navigate('/admin/developers'); }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <span className="text-[11px] font-medium text-slate-500 block">Developers</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-teal-600">{devCount}</span>
            <Code2 className="w-4 h-4 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Section 1: Recent Project Requests */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Project Requests</h2>
            <p className="text-[11px] text-slate-500">Client proposals awaiting architecture review</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/requests')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Requests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Client & Company</th>
                <th className="px-6 py-3">Project Title</th>
                <th className="px-6 py-3">Submitted Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectRequests.slice(0, 4).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <p className="font-bold text-slate-900">{req.clientName}</p>
                    <p className="text-[11px] text-slate-500">{req.companyName}</p>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">
                    {req.projectName}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">{req.submittedDate}</td>
                  <td className="px-6 py-3.5">
                    <Badge status={req.status} size="sm" />
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-1.5">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => acceptAndCreateProjectWorkflow(req.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-2xs"
                        >
                          Accept & Build
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewProjectRequest(req.id, 'Rejected', 'Out of current scope')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-semibold text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDetailId(req.id);
                          navigate(`/admin/requests`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Active Projects Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Active Projects Matrix</h2>
            <p className="text-[11px] text-slate-500">Live progress tracking and deadline delivery</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Client Organization</th>
                <th className="px-6 py-3 w-48">Overall Progress</th>
                <th className="px-6 py-3">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <p className="font-bold text-slate-900">{proj.name}</p>
                    <p className="text-[11px] text-slate-500">{proj.category}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-semibold text-slate-800">{proj.companyName}</span>
                    <p className="text-[11px] text-slate-400">{proj.clientName}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span>{proj.overallProgress}%</span>
                      </div>
                      <ProgressBar progress={proj.overallProgress} size="sm" showLabel={false} />
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">
                    {proj.expectedDelivery}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: User Role Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">User Role Management</h2>
            <p className="text-[11px] text-slate-500">Manage access privileges across the platform</p>
          </div>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={`m-4 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 border shadow-2xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Current Role</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isSelf = currentUser && currentUser.id === user.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center ring-2 ring-slate-100">
                            <span className="text-slate-400 font-bold text-xs">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-500">{user.companyName || user.title || 'Platform User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">{user.email}</td>
                    <td className="px-6 py-3.5">
                      <Badge 
                        status={user.role} 
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={user.role}
                        disabled={updatingUserId === user.id}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all focus:outline-hidden focus:ring-2 cursor-pointer bg-white border-slate-300 text-slate-800 focus:ring-indigo-500"
                      >
                        <option value="CLIENT">Set as CLIENT</option>
                        <option value="DEVELOPER">Set as DEVELOPER</option>
                        <option value="ADMIN">Set as ADMIN</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
