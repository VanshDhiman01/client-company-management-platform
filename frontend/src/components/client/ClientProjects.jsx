import React, { useState } from 'react';
import {
  FolderKanban,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  PlusCircle,
  FilePlus2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { ClientProjectDetails } from './ClientProjectDetails';

export const ClientProjects = () => {
  const {
    currentUser,
    projects,
    selectedDetailId,
    setSelectedDetailId,
    searchQuery
  } = useApp();

  const { id } = useParams();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const activeProjectId = id || selectedDetailId;

  // If a specific project is selected, show details view
  if (activeProjectId) {
    const selectedProj = projects.find((p) => p.id === activeProjectId);
    if (selectedProj) {
      return (
        <ClientProjectDetails
          project={selectedProj}
          onBack={() => {
            setSelectedDetailId(null);
            navigate('/client/projects');
          }}
        />
      );
    }
  }

  const { tasks } = useApp();

  // Filter client's projects
  const clientProjects = projects.filter(
    (p) => p.clientId === currentUser.id || currentUser.id === 'user-client-1'
  );

  const getEffectiveProgress = (proj) => {
    const projTasks = (tasks || []).filter((t) => t.projectId === proj.id);
    if (projTasks.length === 0) return proj.overallProgress || 0;
    const total = projTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
    return Math.round(total / projTasks.length);
  };

  const filtered = clientProjects.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const progress = getEffectiveProgress(p);
    const isCompleted = progress === 100 || p.status === 'Completed' || p.status === 'COMPLETED';

    let matchesStatus = true;
    if (statusFilter === 'In Progress') {
      matchesStatus = !isCompleted;
    } else if (statusFilter === 'Completed') {
      matchesStatus = isCompleted;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time progress and milestone updates across all contracted projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/client/requests')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Submit New Request</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? 'All Projects' : status}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Showing {filtered.length} of {clientProjects.length} projects
        </span>
      </div>

      {/* Project Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200">
            <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No projects found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your filters or search query.</p>
          </div>
        ) : (
          filtered.map((project) => {
            const projProgress = getEffectiveProgress(project);
            const projIsCompleted = projProgress === 100 || project.status === 'Completed' || project.status === 'COMPLETED';
            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                      {project.category}
                    </span>
                    {statusFilter !== 'ALL' && (
                      <Badge status={projIsCompleted ? 'Completed' : 'In Progress'} size="sm" />
                    )}
                  </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Overall Progress - Only shown in In Progress and Completed filter tabs */}
                {statusFilter !== 'ALL' ? (
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">Overall Progress</span>
                      <span className="text-xs font-bold text-indigo-600 tabular-nums">
                        {project.overallProgress}%
                      </span>
                    </div>
                    <ProgressBar progress={project.overallProgress} size="md" showLabel={false} />
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Start: {project.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Delivery: {project.expectedDelivery}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Delivery Date:
                    </span>
                    <span className="font-bold text-indigo-700 tabular-nums">{project.expectedDelivery}</span>
                  </div>
                )}

                {/* Latest Update - Only shown in In Progress and Completed tabs */}
                {statusFilter !== 'ALL' && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-[11px] mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Latest Update:</span>
                    </div>
                    <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed">
                      "The deliverables for this project will be shared with your team soon."
                    </p>
                  </div>
                )}
              </div>

              {/* View Button - Only shown in In Progress and Completed tabs */}
              {statusFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDetailId(project.id);
                    navigate(`/client/projects/${project.id}`);
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
