import React, { useState } from 'react';
import {
  FilePlus2,
  Calendar,
  DollarSign,
  Paperclip,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const ClientProjectRequest = () => {
  const { currentUser, projectRequests, submitProjectRequest, fetchProjectRequests } = useApp();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState([
    'Responsive desktop & mobile user experience',
    'Secure OAuth2 customer authentication'
  ]);
  const [newReqInput, setNewReqInput] = useState('');
  const [expectedDeadline, setExpectedDeadline] = useState('2026-11-30');
  const [budget, setBudget] = useState('$35,000 - $50,000');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Client requests
  const myRequests = projectRequests.filter(
    (r) => !currentUser || r.clientId === currentUser.id || currentUser.id === 'user-client-1'
  );

  const handleAddReq = () => {
    if (!newReqInput.trim()) return;
    setRequirements([...requirements, newReqInput.trim()]);
    setNewReqInput('');
  };

  const handleRemoveReq = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setApiError('');
    setSubmittedSuccess(false);

    try {
      await submitProjectRequest({
        projectName: projectName.trim(),
        description: description.trim(),
        requirements: requirements.length > 0 ? requirements : ['Full turnkey web application architecture'],
        expectedDeadline,
        budget
      });

      setProjectName('');
      setDescription('');
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 5000);
    } catch (err) {
      setApiError(err.message || 'Failed to submit project request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Project Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Submit new project briefs and monitor proposal evaluations by our technical architecture team.
        </p>
      </div>

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-semibold">Submission Failed</p>
            <p className="text-rose-700 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {submittedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold">Project request submitted successfully!</p>
            <p className="text-emerald-700 mt-0.5">
              Status set to <span className="font-bold">Pending</span>. Our project management leads will review the scope and reach out shortly.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Submit Form & Previous Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Submit New Request */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Submit New Project Request
              </h2>
              <p className="text-xs text-slate-500">
                Provide functional requirements and desired delivery timeframe.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B2B Wholesale Procurement Portal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Description & Business Objective *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe what you want to build, target audience, and key business goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Dynamic Requirements List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Key Requirements & Deliverables
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Product catalog, cart, payment, admin panel..."
                  value={newReqInput}
                  onChange={(e) => setNewReqInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddReq();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddReq}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                  >
                    <span>• {req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReq(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Deadline
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={expectedDeadline}
                    onChange={(e) => setExpectedDeadline(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Budget (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="$30,000 - $45,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-2 py-3 px-4 rounded-xl text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Submitted Requests Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Request History</h2>
            <span className="text-xs text-slate-500">{myRequests.length} submitted</span>
          </div>

          <div className="space-y-4">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{req.projectName}</h3>
                    <span className="text-[11px] text-slate-400">
                      Submitted on {req.submittedDate}
                    </span>
                  </div>
                  <Badge status={req.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span className="font-semibold text-slate-700">{req.expectedDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Range:</span>
                    <span className="font-semibold text-slate-700">{req.budget}</span>
                  </div>
                </div>

                {req.adminNotes && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-0.5">PM Feedback:</span>
                    <p className="italic text-slate-600">{req.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
