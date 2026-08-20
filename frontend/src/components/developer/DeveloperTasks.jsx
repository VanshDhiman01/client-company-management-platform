import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Percent,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';

export const DeveloperTasks = () => {
  const {
    currentUser,
    tasks,
    projects,
    updateTaskProgress,
    searchQuery
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  const myTasks = tasks.filter(
    (t) => currentUser && t.assignedDeveloperId === currentUser.id
  );

  const filtered = myTasks.filter((t) => {
    const title = t.title || '';
    const projectName = t.projectName || '';
    const description = t.description || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'ALL' || t.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Engineering Task Queue</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your individual deliverables, update implementation progress, and view PM review feedback.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1 w-fit">
        {['ALL', 'Pending', 'In Progress', 'Needs Changes', 'Completed'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStatusFilter === st
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Tasks' : st}
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Task Title</th>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5 w-48">Progress Percentage</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Review State</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{t.description}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-teal-800">{t.projectName}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                        <span>{t.progress}%</span>
                        <div className="flex gap-1">
                          {[0, 25, 50, 75, 100].map((pVal) => (
                            <button
                              key={pVal}
                              type="button"
                              disabled={t.progress === 100 || t.reviewStatus === 'Approved'}
                              onClick={() => updateTaskProgress(t.id, pVal)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                t.progress === 100 || t.reviewStatus === 'Approved'
                                  ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
                                  : t.progress === pVal
                                  ? 'bg-teal-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
                              }`}
                              title={t.progress === 100 ? 'Task progress is locked at 100%' : `Set to ${pVal}%`}
                            >
                              {pVal}%
                            </button>
                          ))}
                        </div>
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
                        Pending PM Review
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{t.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTaskDetail(t)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTaskDetail && (
        <Modal
          isOpen={!!selectedTaskDetail}
          onClose={() => setSelectedTaskDetail(null)}
          title={`Task: ${selectedTaskDetail.title}`}
          subtitle={`Project: ${selectedTaskDetail.projectName} • Target Delivery: ${selectedTaskDetail.dueDate}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Technical Specification
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedTaskDetail.description}
              </p>
            </div>

            {/* PM Review feedback notes */}
            {selectedTaskDetail.reviewNotes && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>Project Manager Feedback Notes:</span>
                </div>
                <p className="text-slate-700 leading-relaxed pl-5">{selectedTaskDetail.reviewNotes}</p>
              </div>
            )}

            {/* Progress Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Update Progress Percentage
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 25, 50, 75, 100].map((pVal) => (
                  <button
                    key={pVal}
                    type="button"
                    disabled={selectedTaskDetail.progress === 100 || selectedTaskDetail.reviewStatus === 'Approved'}
                    onClick={() => {
                      if (selectedTaskDetail.progress === 100 || selectedTaskDetail.reviewStatus === 'Approved') return;
                      updateTaskProgress(selectedTaskDetail.id, pVal);
                      setSelectedTaskDetail({
                        ...selectedTaskDetail,
                        progress: pVal,
                        status: pVal === 0 ? 'Pending' : 'In Progress',
                        reviewStatus: pVal === 100 ? 'Pending Review' : selectedTaskDetail.reviewStatus
                      });
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      selectedTaskDetail.progress === 100 || selectedTaskDetail.reviewStatus === 'Approved'
                        ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
                        : selectedTaskDetail.progress === pVal
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    {pVal}%
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {selectedTaskDetail.progress === 100
                  ? 'Task progress is 100% completed and locked from modifications.'
                  : 'Setting to 100% automatically alerts the Project Manager for code review and QA test sign-off.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedTaskDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
