import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, RefreshCw, Download } from 'lucide-react';
import { getMyForms, getFormDownloadUrl } from '../../api/forms.api';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate, timeAgo } from '../../utils/formatters';
import { getUploadedFileUrl } from '../../utils/fileUrls';
import toast from 'react-hot-toast';

const STATUSES = ['', 'PENDING', 'APPROVED', 'REJECTED', 'DRAFT', 'RETURNED'];

export default function MyForms() {
  const [forms, setForms] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await getMyForms({ page, limit: 12, status: status || undefined });
      setForms(res.data.data.forms);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchForms(); }, [page, status]);

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Submissions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track all your uploaded form submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-base w-40 text-sm"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
          </select>
          <button onClick={fetchForms} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Refresh">
            <RefreshCw size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <TableSkeleton rows={8} /> : (
          forms.length === 0 ? (
            <EmptyState icon={FileText} title="No submissions found" description="You have not uploaded any completed forms yet." />
          ) : (
            <table className="table-base">
              <thead>
                <tr>
                  <th>Form No.</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form._id}>
                    <td className="font-mono text-brand-600 dark:text-brand-400 font-semibold">#{form.formType}</td>
                    <td className="max-w-xs truncate font-medium">{form.formTitle || '—'}</td>
                    <td><Badge status={form.status} /></td>
                    <td className="text-xs text-slate-400" title={formatDate(form.createdAt)}>{timeAgo(form.createdAt)}</td>
                    <td>
                      {form.attachments?.[0]?.url ? (
                        <a
                          href={getFormDownloadUrl(form._id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                        >
                          <Download size={11} /> Open File
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No file</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/forms/${form._id}`} className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        <Pagination page={pagination.page} pages={pagination.pages} onPage={setPage} />
      </div>
    </div>
  );
}
