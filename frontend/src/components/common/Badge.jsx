import React from 'react';

export const Badge = ({ status, size = 'md', variant = 'status', className = '' }) => {
  const getColors = () => {
    switch (status) {
      // Completed / Approved / Resolved / Active
      case 'Completed':
      case 'Approved':
      case 'Resolved':
      case 'Accepted':
      case 'Active':
      case '100%':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';

      // In Progress / Planning
      case 'In Progress':
      case 'Planning':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';

      // Pending / Open / Medium Priority
      case 'Pending':
      case 'Open':
      case 'Pending Review':
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';

      // Ready for Review
      case 'Ready for Review':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20';

      // Needs Changes / High / Warning
      case 'Needs Changes':
      case 'High':
      case 'Busy':
      case 'On Hold':
        return 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-600/20';

      // Urgent / Rejected / Cancelled / Closed / Not Approved
      case 'Urgent':
      case 'Rejected':
      case 'Cancelled':
      case 'Closed':
      case 'Inactive':
      case 'Not Approved':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';

      // Low priority / Default
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/20';

      // Roles
      case 'CLIENT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/20';
      case 'ADMIN':
        return 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-600/20';
      case 'DEVELOPER':
        return 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-600/20';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 ring-gray-600/20';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs font-medium';
      case 'lg':
        return 'px-3 py-1.5 text-sm font-semibold';
      case 'md':
      default:
        return 'px-2.5 py-1 text-xs font-medium';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset whitespace-nowrap ${getColors()} ${getSize()} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Completed' || status === 'Resolved' || status === 'Accepted'
            ? 'bg-emerald-500'
            : status === 'In Progress' || status === 'Planning'
            ? 'bg-blue-500'
            : status === 'Pending' || status === 'Pending Review' || status === 'Medium'
            ? 'bg-amber-500'
            : status === 'Urgent' || status === 'Rejected'
            ? 'bg-rose-500'
            : status === 'Ready for Review'
            ? 'bg-purple-500'
            : status === 'Needs Changes' || status === 'High'
            ? 'bg-orange-500'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};
