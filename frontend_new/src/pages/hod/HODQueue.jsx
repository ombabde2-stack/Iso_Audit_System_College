import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Clock, RefreshCw, Download, Archive, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getHODQueue } from '../../api/review.api';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate, timeAgo } from '../../utils/formatters';
import { getUploadedFileUrl, getCloudinaryDownloadUrl } from '../../utils/fileUrls';

export default function HODQueue() {
  const [forms, setForms] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING or HISTORY

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await getHODQueue({ page, limit: 15, status: activeTab });
      setForms(res.data.data.forms);
      setPagination(res.data.data.pagination);
    } catch { toast.error('Failed to load queue'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQueue(); }, [page, activeTab]);

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {activeTab === 'PENDING' ? 'Pending Approval Queue' : 'Approval History'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {activeTab === 'PENDING' ? `${pagination.total ?? 0} forms awaiting your review` : `${pagination.total ?? 0} forms you have reviewed`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('PENDING'); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'PENDING' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => { setActiveTab('HISTORY'); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'HISTORY' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              History
            </button>
          </div>
          <button onClick={fetchQueue} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <TableSkeleton rows={8} /> : (
          forms.length === 0 ? (
            <EmptyState 
              icon={activeTab === 'PENDING' ? CheckSquare : Archive} 
              title={activeTab === 'PENDING' ? "Queue is clear!" : "No history yet"} 
              description={activeTab === 'PENDING' ? "No pending forms to review. Great job!" : "You haven't reviewed any forms yet."} 
            />
          ) : (
            <table className="table-base">
              <thead>
                <tr>
                  <th>Form No.</th>
                  <th>Title</th>
                  <th>Submitted By</th>
                  <th>Role</th>
                  <th>{activeTab === 'PENDING' ? 'Submitted' : 'Status'}</th>
                  <th>File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((f) => (
                  <tr key={f._id}>
                    <td className="font-mono text-brand-600 dark:text-brand-400 font-semibold">#{f.formType}</td>
                    <td className="font-medium max-w-[180px] truncate">{f.formTitle || '—'}</td>
                    <td className="text-sm">{f.submittedBy?.name}</td>
                    <td className="text-xs text-slate-400 capitalize">{f.submittedBy?.role}</td>
                    <td className="text-xs">
                      {activeTab === 'PENDING' ? (
                        <span className="text-slate-400" title={formatDate(f.createdAt)}>{timeAgo(f.createdAt)}</span>
                      ) : (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                          f.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          f.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {f.status}
                        </span>
                      )}
                    </td>
                    <td>
                      {f.attachments?.[0]?.url ? (
                        <a
                          href={getCloudinaryDownloadUrl(getUploadedFileUrl(f.attachments[0].url), f.attachments[0].filename)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                        >
                          <Download size={11}/> Open File
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No file</span>
                      )}
                    </td>
                    <td>
                      <Link to={activeTab === 'PENDING' ? `/hod-approval/${f._id}` : `/forms/${f._id}`}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          activeTab === 'PENDING' ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                        {activeTab === 'PENDING' ? <><Clock size={11}/> Review</> : <><Eye size={11}/> View</>}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        {forms.length > 0 && <Pagination page={pagination.page} pages={pagination.pages} onPage={setPage} />}
      </div>
    </div>
  );
}
