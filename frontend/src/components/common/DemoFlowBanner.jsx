import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Shield, Code2, ChevronDown, ChevronUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const DemoFlowBanner = () => {
  const { currentUser, resetDemoData, setSelectedDetailId } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const allSteps = [
    {
      num: 1,
      title: 'Client Request',
      desc: 'Submit project request',
      role: 'CLIENT',
      action: () => {
        setSelectedDetailId(null);
        navigate('/client/requests');
      }
    },
    {
      num: 2,
      title: 'Admin Review & Create',
      desc: 'Review requests and initiate project',
      role: 'ADMIN',
      action: () => {
        setSelectedDetailId(null);
        navigate('/admin/requests');
      }
    },
    {
      num: 3,
      title: 'Task Assignment',
      desc: 'Assign tasks to developers',
      role: 'ADMIN',
      action: () => {
        setSelectedDetailId(null);
        navigate('/admin/tasks');
      }
    },
    {
      num: 4,
      title: 'Dev Tasks',
      desc: 'Update task progress and work notes',
      role: 'DEVELOPER',
      action: () => {
        setSelectedDetailId(null);
        navigate('/developer/tasks');
      }
    },
    {
      num: 5,
      title: 'PM Project Review',
      desc: 'Review project progress and tasks',
      role: 'ADMIN',
      action: () => {
        setSelectedDetailId(null);
        navigate('/admin/projects');
      }
    },
    {
      num: 6,
      title: 'Client Overview',
      desc: 'View overall project progress',
      role: 'CLIENT',
      action: () => {
        setSelectedDetailId(null);
        navigate('/client/projects');
      }
    },
    {
      num: 7,
      title: 'Support Tickets',
      desc: 'Manage support tickets',
      role: currentUser.role,
      action: () => {
        setSelectedDetailId(null);
        const path = currentUser.role === 'CLIENT' ? '/client/tickets' : currentUser.role === 'ADMIN' ? '/admin/tickets' : '/developer/tickets';
        navigate(path);
      }
    }
  ];

  const roleSteps = allSteps.filter(s => s.role === currentUser.role);

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Orange Mantra – Interview Project</span>
          </div>
          <span className="text-slate-300 text-xs">
            Authenticated User: <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.role})
          </span>
        </div>

      </div>
    </div>
  );
};
