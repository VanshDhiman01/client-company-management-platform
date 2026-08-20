import React from 'react';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const UnauthorizedPage = ({ requiredRole }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (currentUser.role === 'CLIENT') return '/client/dashboard';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    if (currentUser.role === 'DEVELOPER') return '/developer/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5 text-rose-600 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 mb-3">
          403 Access Denied
        </span>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Unauthorized Access
        </h1>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Your current account role (<span className="font-semibold text-slate-700">{currentUser.role}</span>) does not have permission to view {requiredRole ? `the ${requiredRole} area` : 'this page'}. Frontend role-based access control (RBAC) has secured this route.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(getDashboardPath())}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
