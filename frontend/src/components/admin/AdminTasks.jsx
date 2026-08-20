import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  Code2,
  ArrowRight,
  Shield,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';

export const AdminTasks = () => {
  const {
    tasks,
    projects,
    users,
    createTask,
    reviewTask,
    updateTaskProgress,
    fetchUsers,
    fetchProjects,
    fetchTasks,
    searchQuery
  } = useApp();

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchTasks();
  }, []);

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');
  const [selectedDevFilter, setSelectedDevFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const developers = users.filter((u) => u.role === 'DEVELOPER');

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjectId, setTaskProjectId] = useState(projects[0]?.id || '');
  const [taskDevId, setTaskDevId] = useState(developers[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskDueDate, setTaskDueDate] = useState('2026-06-15');
  const [taskProgress, setTaskProgress] = useState(0);

  // Review task modal state
  const [reviewTaskItem, setReviewTaskItem] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('Approved');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    if (!taskDevId && developers.length > 0) {
      setTaskDevId(developers[0].id);
    }
  }, [developers, taskDevId]);

  useEffect(() => {
    if (!taskProjectId && projects.length > 0) {
      setTaskProjectId(projects[0].id);
    }
  }, [projects, taskProjectId]);

  const filteredTasks = tasks.filter((t) => {
    const title = t.title || '';
    const projectName = t.projectName || '';
    const devName = t.assignedDeveloperName || (t.assignedDeveloperId ? users.find((u) => u.id === t.assignedDeveloperId)?.name : '') || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      devName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProj = selectedProjectFilter === 'ALL' || t.projectId === selectedProjectFilter;
    const matchesDev = selectedDevFilter === 'ALL' || t.assignedDeveloperId === selectedDevFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || t.status === selectedStatusFilter;
    return matchesSearch && matchesProj && matchesDev && matchesStatus;
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const chosenDevId = taskDevId || developers[0]?.id || '';
    const chosenDev = users.find((u) => u.id === chosenDevId);
    const chosenProjId = taskProjectId || projects[0]?.id || '';
    const chosenProj = projects.find((p) => p.id === chosenProjId);

    try {
      await createTask({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        projectId: chosenProjId,
        projectName: chosenProj?.name || '',
        assignedDeveloperId: chosenDevId,
        assignedDeveloperName: chosenDev?.name || '',
        priority: taskPriority,
        dueDate: taskDueDate,
        initialProgress: taskProgress
      });

      setTaskTitle('');
      setTaskDesc('');
      setIsNewTaskOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleConfirmReview = async () => {
    if (!reviewTaskItem) return;
    try {
      if (reviewDecision === 'Approved') {
        await reviewTask(reviewTaskItem.id, 'Approved', reviewNotes || 'Code review passed, tested on staging');
      } else {
        await reviewTask(reviewTaskItem.id, 'Not Approved', reviewNotes || 'Please fix identified test failures');
      }
      setReviewTaskItem(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Failed to review task:', err);
    }
  };

  // Selected project for breakdown inspection
  const inspectionProject = projects.find((p) => p.id === (selectedProjectFilter !== 'ALL' ? selectedProjectFilter : 'proj-001')) || projects[0];
  const inspectionTasks = tasks.filter((t) => t.projectId === inspectionProject?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Task Management & Review</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create technical tasks, assign developers, monitor completion milestones, and execute QA sign-offs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsNewTaskOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Progress Calculation Breakdown Banner */}
      {inspectionProject && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-1 border border-violet-500/30">
                <Percent className="w-3.5 h-3.5" />
                <span>Live Mathematical Progress Engine</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {inspectionProject.name} — Overall Progress: {inspectionProject.overallProgress}%
              </h2>
              <p className="text-xs text-slate-300">
                Calculated strictly as the average of its {inspectionTasks.length} assigned task percentages.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <ProgressBar progress={inspectionProject.overallProgress} size="md" showLabel={true} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            {inspectionTasks.slice(0, 10).map((t) => (
              <div key={t.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-slate-300 font-semibold truncate">{t.title}</p>
                <div className="flex items-center justify-between mt-1 text-slate-400">
                  <span className="text-teal-400 font-mono font-bold">{t.progress}%</span>
                  <span className="text-[10px]">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Project</label>
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Developer</label>
          <select
            value={selectedDevFilter}
            onChange={(e) => setSelectedDevFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500"
          >
            <option value="ALL">All Developers</option>
            {developers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Status</label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Needs Changes">Needs Changes</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-400 self-end pb-2">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Tasks Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Task & Project</th>
                <th className="px-6 py-3.5">Assigned Developer</th>
                <th className="px-6 py-3.5 w-44">Progress Percentage</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Review State</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{task.title}</p>
                    <p className="text-[11px] text-violet-700 font-medium">{task.projectName}</p>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const resolvedName = task.assignedDeveloperName || (task.assignedDeveloperId ? users.find((u) => u.id === task.assignedDeveloperId)?.name : null);
                      return resolvedName ? (
                        <span className="font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 text-[11px]">
                          {resolvedName}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-normal italic">
                          Unassigned
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{task.progress}%</span>
                        <div className="flex gap-1">
                          {[0, 25, 50, 75, 100].map((pVal) => (
                            <button
                              key={pVal}
                              type="button"
                              disabled={task.progress === 100 || task.reviewStatus === 'Approved'}
                              onClick={() => updateTaskProgress(task.id, pVal)}
                              className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                                task.progress === 100 || task.reviewStatus === 'Approved'
                                  ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
                                  : task.progress === pVal
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer'
                              }`}
                              title={task.progress === 100 ? 'Task progress 100% is locked' : `Set to ${pVal}%`}
                            >
                              {pVal}%
                            </button>
                          ))}
                        </div>
                      </div>
                      <ProgressBar progress={task.progress} size="sm" showLabel={false} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={task.priority} variant="priority" size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={task.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    {task.reviewStatus === 'Approved' && (
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        Approved
                      </span>
                    )}
                    {(task.reviewStatus === 'Not Approved' || task.reviewStatus === 'Needs Changes') && (
                      <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                        Not Approved
                      </span>
                    )}
                    {task.reviewStatus === 'Pending Review' && (
                      <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                        Pending Review
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{task.dueDate}</td>
                  <td className="px-6 py-4 text-right space-x-1">
                    {task.reviewStatus === 'Approved' ? (
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-not-allowed inline-block">
                        Approved & Locked
                      </span>
                    ) : task.reviewStatus === 'Not Approved' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewTaskItem(task);
                          setReviewDecision('Approved');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 cursor-pointer"
                      >
                        Re-Review Task
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewTaskItem(task);
                          setReviewDecision('Approved');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-2xs cursor-pointer"
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

      {/* Modal: Create Task */}
      <Modal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Create New Engineering Task"
        subtitle="Provision a deliverable and assign an internal engineer."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project *
              </label>
              <select
                value={taskProjectId}
                onChange={(e) => setTaskProjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.companyName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Developer *
              </label>
              <select
                value={taskDevId}
                onChange={(e) => setTaskDevId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                {developers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement Payment Webhook Handler"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Due Date
              </label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Progress
              </label>
              <select
                value={taskProgress}
                onChange={(e) => setTaskProgress(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                <option value={0}>0%</option>
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              placeholder="Technical requirements, architecture dependencies, testing standards..."
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

      {/* Modal: PM Task Review */}
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
                      onClick={() => setReviewDecision('Approved')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        reviewDecision === 'Approved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewDecision('Not Approved')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        reviewDecision === 'Not Approved'
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
                    Review Feedback / Internal Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add constructive engineering notes..."
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
                    Confirm Decision
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
