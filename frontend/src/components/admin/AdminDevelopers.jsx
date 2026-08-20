import React, { useState } from 'react';
import {
  Code2,
  Mail,
  CheckSquare,
  CheckCircle2,
  Clock,
  Layers,
  FolderKanban,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const AdminDevelopers = () => {
  const { currentUser, users, tasks, projects, setSelectedDetailId, setActiveTab, searchQuery } = useApp();

  const developers = users.filter((u) => u.role === 'DEVELOPER');

  const filtered = developers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Engineering Staff & Resources</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Internal developers, workload utilization, project allocations, and completion velocity.
          </p>
        </div>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dev) => {
          const isSelf = currentUser && currentUser.id === dev.id;

          return (
            <div
              key={dev.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4"
            >
              <div className="flex flex-col items-center space-y-2">
                {dev.avatar ? (
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center ring-2 ring-teal-200">
                    <span className="text-teal-400 font-bold text-xl">{dev.name.charAt(0)}</span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-900">{dev.name}</h3>
                <p className="text-xs text-teal-700 font-medium">{dev.email}</p>
                <p className="text-[11px] text-slate-500">{dev.title || 'Software Engineer'}</p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-500">Access Role:</span>
                <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  dev.role === 'ADMIN'
                    ? 'bg-violet-50 text-violet-800 border-violet-200'
                    : dev.role === 'DEVELOPER'
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                }`}>
                  {dev.role}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

