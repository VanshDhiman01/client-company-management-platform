import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  LifeBuoy,
  MessageSquare,
  ArrowUpRight,
  Calendar,
  Clock,
  PlusCircle,
  TrendingUp,
  FilePlus2,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar, CircularProgress } from '../common/ProgressBar';

export const ClientDashboard = () => {
  const {
    currentUser,
    projects,
    tasks,
    conversations,
    setSelectedDetailId,
    searchQuery
  } = useApp();

  const navigate = useNavigate();

  // Client only sees their own projects
  const clientProjects = projects.filter(
    (p) => p.clientId === currentUser.id || currentUser.id === 'user-client-1' // fallback for demo
  );

  const getProjectProgress = (p) => {
    const projTasks = (tasks || []).filter((t) => t.projectId === p.id);
    if (projTasks.length === 0) return p.overallProgress || 0;
    const sum = projTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
    return Math.round(sum / projTasks.length);
  };

  const filteredProjects = clientProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjects = clientProjects.filter((p) => getProjectProgress(p) < 100 && p.status !== 'Completed' && p.status !== 'COMPLETED');
  const completedProjects = clientProjects.filter((p) => getProjectProgress(p) === 100 || p.status === 'Completed' || p.status === 'COMPLETED');
  const unreadMessages = conversations.reduce(
    (acc, c) => ((c.clientId === currentUser.id || currentUser.id === 'user-client-1') ? acc + c.unreadCountClient : acc),
    0
  );

  const handleViewProject = (projId) => {
    setSelectedDetailId(projId);
    navigate(`/client/projects/${projId}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>{currentUser.companyName || 'Apex Retail Brands'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Track real-time progress across active company projects, collaborate directly with your project managers, and manage deliverables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/client/requests')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Submit New Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Active Projects */}
        <div
          onClick={() => { setSelectedDetailId(null); navigate('/client/projects'); }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Projects</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{activeProjects.length}</span>
            <span className="text-xs font-medium text-blue-600 flex items-center gap-0.5">
              In Delivery
            </span>
          </div>
        </div>

        {/* Completed Projects */}
        <div
          onClick={() => { setSelectedDetailId(null); navigate('/client/projects'); }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completed Projects</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{completedProjects.length}</span>
            <span className="text-xs font-medium text-emerald-600">
              100% Delivered
            </span>
          </div>
        </div>


      </div>

      {/* "My Projects" Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live delivery progress and latest official company updates
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/client/projects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200/90 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                      {project.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {project.name}
                    </h3>
                  </div>
                  <Badge status={(getProjectProgress(project) === 100 || project.status === 'Completed' || project.status === 'COMPLETED') ? 'Completed' : 'In Progress'} size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Overall Progress visualizer */}
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-2xs mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Overall Progress
                    </span>
                    <span className="text-xs font-bold text-indigo-600 tabular-nums">
                      {project.overallProgress}%
                    </span>
                  </div>
                  <ProgressBar progress={project.overallProgress} size="md" showLabel={false} />
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Started: {project.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Delivery: {project.expectedDelivery}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
