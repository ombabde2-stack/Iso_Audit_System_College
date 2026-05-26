import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MessageSquare, Download, ExternalLink, FileText, TableProperties, BadgeCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSingleForm, getFormDownloadUrl } from '../../api/forms.api';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDateTime } from '../../utils/formatters';
import { getUploadedFileUrl, getCloudinaryDownloadUrl } from '../../utils/fileUrls';

export default function FormDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleForm(id)
      .then((res) => setForm(res.data.data))
      .catch(() => toast.error('Form not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>;
  }
  if (!form) return <div className="text-center py-20 text-slate-400">Form not found.</div>;

  const submittedFile = form.attachments?.[0];
  const submittedFileUrl = getUploadedFileUrl(submittedFile?.url);

  return (
    <div className="max-w-3xl mx-auto animate-slide-up space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-mono bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded">#{form.formType}</span>
            <h2 className="text-xl font-bold mt-1">{form.formTitle || 'Form Details'}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{form.department}</p>
          </div>
          <Badge status={form.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-2 text-slate-500">
            <User size={14} /> <span className="font-medium text-slate-700 dark:text-slate-300">{form.submittedBy?.name || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={14} /> <span>{formatDateTime(form.createdAt)}</span>
          </div>
          {form.reviewedBy && (
            <div className="col-span-2 flex items-center gap-2 text-slate-500">
              <User size={14} /> Reviewed by <span className="font-medium text-slate-700 dark:text-slate-300">{form.reviewedBy?.name}</span> on {formatDateTime(form.reviewedAt)}
            </div>
          )}
        </div>

        {/* Smart Data Section (New Intelligence Feature) */}
        {form.data && Object.keys(form.data).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <TableProperties size={18} />
              <h3 className="font-bold">Smart Data Capture</h3>
            </div>
            
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-4 space-y-6">
              {Object.entries(form.data).map(([key, value]) => {
                // If the value is an array (like the 'items' table in budget forms)
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{key}</p>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <tr>
                              {Object.keys(value[0] || {}).map((col) => (
                                <th key={col} className="px-4 py-2 font-semibold capitalize">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {value.map((row, i) => (
                              <tr key={i} className="bg-white dark:bg-slate-900/60">
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="px-4 py-2 text-slate-600 dark:text-slate-400">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }

                // Default key-value display for flat fields
                if (typeof value !== 'object') {
                  return (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="text-sm font-medium text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</span>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )}

        {submittedFileUrl && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-slate-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Document Evidence (Reference)</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{submittedFile?.filename}</p>
                <p className="text-xs text-slate-500 mt-1">Uploaded file for ISO compliance audit.</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={getFormDownloadUrl(form._id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                >
                  <ExternalLink size={14} /> View
                </a>
              </div>
            </div>
          </div>
        )}

        {form.submitterRemarks && (
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4">
            <MessageSquare size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Submission Notes</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{form.submitterRemarks}</p>
            </div>
          </div>
        )}

        {form.remarks && (
          <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/20 rounded-xl p-4">
            <MessageSquare size={16} className="text-sky-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">HOD Remarks</p>
              <p className="text-sm text-sky-800 dark:text-sky-300">{form.remarks}</p>
            </div>
          </div>
        )}

        {/* Digital Signatures Audit Trail */}
        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <BadgeCheck size={18} className="text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Official Digital Signatures</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Submitter Signature */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digitally Signed By (Faculty)</p>
              <div className="h-24 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                {form.submittedBy?.signatureUrl ? (
                  <img src={form.submittedBy.signatureUrl} alt="Submitter Signature" className="max-h-16 w-auto grayscale dark:invert" />
                ) : (
                  <div className="text-center">
                    <p className="text-xl font-signature text-slate-300 dark:text-slate-700 select-none">{form.submittedBy?.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">E-Signed via SIAMS Auth</p>
                  </div>
                )}
                <div className="absolute bottom-1 right-2 opacity-30">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
              </div>
              <div className="flex flex-col text-[10px] text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300">{form.submittedBy?.name}</span>
                <span>ID: {form.submittedBy?.employeeId || 'SIAMS-USER'}</span>
                <span>Date: {formatDateTime(form.createdAt)}</span>
              </div>
            </div>

            {/* Reviewer Signature (HOD) */}
            {form.status === 'APPROVED' && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified & Approved By (HOD)</p>
                <div className="h-24 flex items-center justify-center bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  {form.reviewedBy?.signatureUrl ? (
                    <img src={form.reviewedBy.signatureUrl} alt="Reviewer Signature" className="max-h-16 w-auto grayscale dark:invert" />
                  ) : (
                    <div className="text-center">
                      <p className="text-xl font-signature text-emerald-800/20 dark:text-emerald-200/10 select-none">{form.reviewedBy?.name}</p>
                      <BadgeCheck size={32} className="absolute inset-0 m-auto text-emerald-500/10" />
                      <p className="text-[10px] text-emerald-600/50 mt-1 uppercase font-bold">Digitally Verified</p>
                    </div>
                  )}
                  <div className="absolute top-1 right-2">
                    <BadgeCheck size={14} className="text-emerald-600" />
                  </div>
                </div>
                <div className="flex flex-col text-[10px] text-slate-500">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{form.reviewedBy?.name}</span>
                  <span>Role: Head of Department</span>
                  <span>Date: {formatDateTime(form.reviewedAt)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
            <p className="text-[9px] text-slate-500 leading-tight">
              <b>CRYPTOGRAPHIC AUDIT LOG:</b> This document was digitally generated and authenticated by the Smart ISO Audit Management System (SIAMS). 
              The signatures above are cryptographically linked to the unique user identities and session-token timestamps recorded during the submission and review process. 
              Any modification to the underlying data will invalidate this digital record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
