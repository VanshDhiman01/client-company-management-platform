import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus2,
  MessageSquare,
  LifeBuoy,
  FileText,
  User,
  LogOut,
  Users,
  CheckSquare,
  Code2,
  Building2,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const {
    currentUser,
    setSelectedDetailId,
    logout,
    projectRequests,
    tasks,
    conversations
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    setSelectedDetailId(null);
    navigate(path);
    onClose();
  };

  // Count badges
  const pendingRequestsCount = projectRequests.filter(r => r.status === 'Pending').length;
  const devAssignedTasks = tasks.filter(
    t => t.assignedDeveloperId === currentUser.id && t.status !== 'Completed'
  ).length;
  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (currentUser.role === 'CLIENT' ? c.unreadCountClient : c.unreadCountAdmin),
    0
  );

  // Client Navigation items
  const clientNavItems = [
    { path: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/client/projects', label: 'My Projects', icon: FolderKanban },
    {
      path: '/client/requests',
      label: 'Project Requests',
      icon: FilePlus2,
      badge: projectRequests.filter(r => r.clientId === currentUser.id && r.status === 'Pending').length || undefined
    },
    {
      path: '/client/messages',
      label: 'Messages',
      icon: MessageSquare
    },
    { path: '/client/profile', label: 'Profile', icon: User }
  ];

  // Admin Navigation items
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },

    {
      path: '/admin/requests',
      label: 'Project Requests',
      icon: FilePlus2,
      badge: pendingRequestsCount || undefined
    },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/admin/developers', label: 'Developers', icon: Code2 },
    {
      path: '/admin/messages',
      label: 'Messages',
      icon: MessageSquare
    },
    { path: '/admin/profile', label: 'Profile', icon: User }
  ];

  // Developer Navigation items
  const devNavItems = [
    { path: '/developer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/developer/projects', label: 'My Projects', icon: FolderKanban },
    {
      path: '/developer/tasks',
      label: 'My Tasks',
      icon: CheckSquare
    },
    { path: '/developer/profile', label: 'Profile', icon: User }
  ];

  const currentNavItems =
    currentUser.role === 'CLIENT'
      ? clientNavItems
      : currentUser.role === 'ADMIN'
      ? adminNavItems
      : devNavItems;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                Orange Mantra – Interview Project
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                {currentUser.role === 'CLIENT'
                  ? 'Client Portal'
                  : currentUser.role === 'ADMIN'
                  ? 'Admin & PM Console'
                  : 'Developer Studio'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Snapshot in Sidebar */}
        <div className="px-4 py-3.5 mx-3 mt-3 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-indigo-500/30 shrink-0">
              <span className="text-slate-300 font-bold text-xs">{currentUser.name.charAt(0)}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">
              {currentUser.companyName || currentUser.title || currentUser.role}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-3 border-t border-slate-800 shrink-0 space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
