import React from 'react';
import {
  FolderKanban,
  Calendar,
  Clock,
  CheckSquare,
  Code2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const DeveloperProjects = () => {
  const { currentUser, projects, tasks, setActiveTab, searchQuery } = useApp();

  const myProjects = projects.filter(
    (p) => !currentUser || (p.assignedDeveloperIds && p.assignedDeveloperIds.includes(currentUser.id)) || currentUser.role === 'DEVELOPER'
  );

  const filtered = myProjects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Assigned Software Projects</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Projects where you have active sprint tasks and architecture assignments.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const myProjTasks = projTasks.filter(
            (t) => currentUser && t.assignedDeveloperId === currentUser.id
          );

          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-lg hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wide">
                    {proj.category}
                  </span>
                  <Badge status={proj.overallProgress === 100 ? 'Completed' : 'In Progress'} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Overall Project Progress */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">Project Overall Completion</span>
                    <span className="text-xs font-bold text-teal-700 tabular-nums">
                      {proj.overallProgress}%
                    </span>
                  </div>
                  <ProgressBar progress={proj.overallProgress} size="md" showLabel={false} />

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Kickoff: {proj.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Target: {proj.expectedDelivery}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
