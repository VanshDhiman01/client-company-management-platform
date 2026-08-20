import React from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  LifeBuoy,
  Code2,
  Layers,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  FolderKanban
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const DeveloperDashboard = () => {
  const {
    currentUser,
    tasks,
    projects,
    updateTaskProgress,
    setSelectedDetailId,
    searchQuery
  } = useApp();

  const navigate = useNavigate();

  // Developer's tasks
  const myTasks = tasks.filter(
    (t) => currentUser && t.assignedDeveloperId === currentUser.id
  );

  const myProjects = projects.filter(
    (p) => currentUser && p.assignedDeveloperIds && p.assignedDeveloperIds.includes(currentUser.id)
  );

  const completedTasks = myTasks.filter((t) => t.status === 'Completed');
  const inProgressTasks = myTasks.filter((t) => t.status === 'In Progress');
  const needsChangesTasks = myTasks.filter((t) => t.status === 'Needs Changes');

  const filteredTasks = myTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
              <Code2 className="w-3.5 h-3.5" />
              <span>Developer Engineering Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Track your sprint deliverables, update milestone completion percentages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/developer/tasks')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>View All My Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Needs changes alert banner */}
      {needsChangesTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900">
                {needsChangesTasks.length} Task(s) Require Revisions from PM Review
              </p>
              <p className="text-[11px] text-rose-700">
                Check the PM review notes and adjust implementation before resubmitting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/developer/tasks')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            Fix Tasks
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => { setSelectedDetailId(null); navigate('/developer/tasks'); }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">My Assigned Tasks</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{myTasks.length}</span>
            <span className="text-xs font-medium text-blue-600">Active Workload</span>
          </div>
        </div>

        <div
          onClick={() => { setSelectedDetailId(null); navigate('/developer/projects'); }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Assigned Projects</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{myProjects.length}</span>
            <span className="text-xs font-medium text-emerald-600">Engineering</span>
          </div>
        </div>
      </div>

      {/* My Active Tasks Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">My Assigned Tasks</h2>
            <p className="text-[11px] text-slate-500">Update progress milestone: 0% → 25% → 50% → 75% → 100%</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/developer/tasks')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Task Backlog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Task & Project</th>
                <th className="px-6 py-3.5 w-44">Progress</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Review State</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-teal-700 font-medium">{t.projectName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{t.progress}%</span>
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
                    {t.reviewStatus === 'Needs Changes' && (
                      <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                        Needs Changes
                      </span>
                    )}
                    {t.reviewStatus === 'Pending Review' && (
                      <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                        Pending PM Review
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{t.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {[0, 25, 50, 75, 100].map((pVal) => (
                        <button
                          key={pVal}
                          type="button"
                          onClick={() => updateTaskProgress(t.id, pVal)}
                          className={`px-1.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                            t.progress === pVal
                              ? 'bg-teal-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {pVal}%
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
