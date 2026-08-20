import React, { useState } from 'react';
import {
  Users,
  Building2,
  Mail,
  Phone,
  Calendar,
  FolderKanban,
  LifeBuoy,
  ArrowUpRight,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  ShieldCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminClients = () => {
  const {
    currentUser,
    users,
    projects,
    tickets,
    conversations,
    setSelectedDetailId,
    setActiveTab,
    searchQuery
  } = useApp();

  const [selectedClient, setSelectedClient] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    const query = searchQuery.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.companyName && u.companyName.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">User & Role Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Admin Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage user accounts, corporate clients, engineering staff roles, and access privileges.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              roleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('CLIENT')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              roleFilter === 'CLIENT' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clients ({users.filter(u => u.role === 'CLIENT').length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('DEVELOPER')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              roleFilter === 'DEVELOPER' ? 'bg-white text-teal-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Developers ({users.filter(u => u.role === 'DEVELOPER').length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              roleFilter === 'ADMIN' ? 'bg-white text-violet-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admins ({users.filter(u => u.role === 'ADMIN').length})
          </button>
        </div>
      </div>

      {/* Users & Clients Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">User & Organization</th>
                <th className="px-6 py-3.5">Contact Email</th>
                <th className="px-6 py-3.5">Projects</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const userProjects = projects.filter((p) => p.clientId === user.id);
                const isSelf = currentUser && currentUser.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center ring-2 ring-slate-100">
                            <span className="text-slate-400 font-bold text-xs">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900">{user.name}</p>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">{user.companyName || user.title || 'Platform User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{userProjects.length}</span>
                      <span className="text-slate-400"> projects</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : '2026-01-10'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedClient(user)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={`${selectedClient.name} — ${selectedClient.companyName || selectedClient.role}`}
          subtitle="User account details, assigned role governance, and project activity."
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Header summary */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-4">
                {selectedClient.avatar ? (
                  <img
                    src={selectedClient.avatar}
                    alt={selectedClient.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center ring-2 ring-indigo-200">
                    <span className="text-indigo-300 font-bold text-xl">{selectedClient.name.charAt(0)}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{selectedClient.name}</h3>
                  <p className="text-xs text-slate-600">{selectedClient.companyName || selectedClient.title}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{selectedClient.email}</span>
                    <span>•</span>
                    {selectedClient.phone && <span>{selectedClient.phone}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Projects List */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Contracted Projects
              </h4>
              <div className="space-y-2">
                {projects
                  .filter((p) => p.clientId === selectedClient.id)
                  .map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 hover:border-indigo-300 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{proj.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {proj.category} • Expected Delivery: {proj.expectedDelivery}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-600">{proj.overallProgress}%</span>
                        <Badge status={proj.overallProgress === 100 ? 'Completed' : 'In Progress'} size="sm" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDetailId(proj.id);
                            setSelectedClient(null);
                            setActiveTab('projects');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Open Project
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
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

