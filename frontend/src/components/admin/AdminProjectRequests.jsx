import React, { useState } from 'react';
import {
  FilePlus2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Paperclip,
  ArrowRight,
  FolderKanban,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminProjectRequests = () => {
  const {
    projectRequests,
    reviewProjectRequest,
    acceptAndCreateProjectWorkflow,
    setActiveTab,
    setSelectedDetailId,
    searchQuery
  } = useApp();

  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = projectRequests.filter((r) => {
    const pName = r.projectName || '';
    const cName = r.clientName || '';
    const compName = r.companyName || '';
    const desc = r.description || '';
    const matchesSearch =
      pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      compName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAccept = async (reqId) => {
    const newProj = await acceptAndCreateProjectWorkflow(reqId);
    setSelectedReq(null);
    if (newProj && newProj.id) {
      setSelectedDetailId(newProj.id);
      setActiveTab('projects');
    }
  };

  const handleReject = () => {
    if (!selectedReq) return;
    reviewProjectRequest(selectedReq.id, 'Rejected', rejectReason || 'Scope does not match technical roadmap');
    setRejectModalOpen(false);
    setSelectedReq(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Project Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate inbound project scopes from clients, configure delivery milestones, and provision active projects.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs w-fit">
        {['ALL', 'Pending', 'Accepted', 'Rejected'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === status
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status === 'ALL' ? 'All Requests' : status}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Client & Company</th>
                <th className="px-6 py-3.5">Requested Project</th>
                <th className="px-6 py-3.5">Submitted Date</th>
                <th className="px-6 py-3.5">Target Deadline</th>
                <th className="px-6 py-3.5">Budget</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    No project requests found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{req.clientName}</p>
                      <p className="text-[11px] text-slate-500">{req.companyName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{req.projectName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{req.description}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{req.submittedDate}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{req.expectedDeadline}</td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{req.budget}</td>
                    <td className="px-6 py-4">
                      <Badge status={req.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReq(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
                      >
                        Review
                      </button>
                      {req.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleAccept(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-2xs"
                        >
                          Accept & Build
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Request Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Review Request: ${selectedReq.projectName}`}
          subtitle={`Submitted by ${selectedReq.clientName} (${selectedReq.companyName}) on ${selectedReq.submittedDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Executive Project Summary
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedReq.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Requirements & Functional Features
              </h4>
              <div className="space-y-1.5">
                {selectedReq.requirements.map((reqItem, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                    <span>{reqItem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Target Completion Date</span>
                <span className="font-bold text-slate-800">{selectedReq.expectedDeadline}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Estimated Budget</span>
                <span className="font-bold text-slate-800">{selectedReq.budget}</span>
              </div>
            </div>

            {selectedReq.attachments && selectedReq.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Client Attachments
                </h4>
                {selectedReq.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 text-xs text-slate-700 mr-2"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.size})</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Current Status: <Badge status={selectedReq.status} size="sm" />
              </span>

              <div className="flex items-center gap-2">
                {selectedReq.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setRejectModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-all"
                    >
                      Reject Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(selectedReq.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept & Initialize Project</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedReq(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Provide Rejection Reason"
          subtitle="This reason will be provided as constructive feedback to the client."
          maxWidth="md"
        >
          <div className="space-y-4">
            <textarea
              rows={3}
              placeholder="e.g. Current capacity is allocated until Q4; budget does not match technical scope..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
