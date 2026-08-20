import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Users,
  Layers,
  Code2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';
import { AdminProjectDetails } from './AdminProjectDetails';

export const AdminProjects = () => {
  const {
    projects,
    users,
    selectedDetailId,
    setSelectedDetailId,
    createProject,
    searchQuery
  } = useApp();

  const { id } = useParams();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const activeProjectId = id || selectedDetailId;

  // New project state
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('Custom Web App');
  const [projClientId, setProjClientId] = useState(users.find(u => u.role === 'CLIENT')?.id || 'user-client-1');
  const [projStartDate, setProjStartDate] = useState('2026-04-01');
  const [projDelivery, setProjDelivery] = useState('2026-09-30');
  const [projBudget, setProjBudget] = useState('$50,000');

  // If a project is selected, show details
  if (activeProjectId) {
    const selectedProj = projects.find((p) => p.id === activeProjectId);
    if (selectedProj) {
      return (
        <AdminProjectDetails
          project={selectedProj}
          onBack={() => {
            setSelectedDetailId(null);
            navigate('/admin/projects');
          }}
        />
      );
    }
  }

  const clients = users.filter((u) => u.role === 'CLIENT');

  const filtered = projects.filter((p) => {
    const name = p.name || '';
    const clientName = p.clientName || '';
    const companyName = p.companyName || '';
    const category = p.category || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());

    const progress = p.overallProgress || 0;
    let matchesStatus = true;
    if (statusFilter === 'In Progress') {
      matchesStatus = progress < 100;
    } else if (statusFilter === 'Completed') {
      matchesStatus = progress === 100 || p.status === 'Completed';
    }

    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projName.trim() || !projDesc.trim()) return;

    try {
      await createProject({
        name: projName.trim(),
        description: projDesc.trim(),
        category: projCategory,
        clientId: projClientId,
        startDate: projStartDate,
        expectedDelivery: projDelivery,
        budget: projBudget
      });

      setProjName('');
      setProjDesc('');
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Project Master Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administer active software builds, task percentages, engineering allocations, and client releases.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['ALL', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All Projects' : st}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Showing {filtered.length} of {projects.length} projects
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-violet-600 uppercase tracking-wide">
                  {proj.category}
                </span>
                <Badge status={(proj.overallProgress || 0) === 100 ? 'Completed' : 'In Progress'} size="sm" />
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Client: {proj.companyName} ({proj.clientName})
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Progress visualizer */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Project Progress</span>
                  <span className="text-xs font-bold text-violet-600 tabular-nums">
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
                    Delivery: {proj.expectedDelivery}
                  </span>
                </div>
              </div>

              {/* Internal assigned developers badge */}
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium text-teal-700">
                  <Code2 className="w-3.5 h-3.5 text-teal-600" />
                  {(proj.assignedDeveloperIds || []).length} Developers Assigned
                </span>
                <span className="font-semibold text-slate-700">{proj.budget}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create New Project */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Initialize New Project"
        subtitle="Provision a project workspace, associate client, and setup task backlog."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Omnichannel E-Commerce Platform"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Organization *
              </label>
              <select
                value={projClientId}
                onChange={(e) => setProjClientId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={projCategory}
                onChange={(e) => setProjCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={projStartDate}
                onChange={(e) => setProjStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Delivery
              </label>
              <input
                type="date"
                value={projDelivery}
                onChange={(e) => setProjDelivery(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budget
              </label>
              <input
                type="text"
                value={projBudget}
                onChange={(e) => setProjBudget(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Description & Scope *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detailed architecture scope and technical objectives..."
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
