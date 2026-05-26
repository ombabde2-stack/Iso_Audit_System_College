import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, FileText, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { getMyTemplates } from '../../api/formTemplate.api';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatters';
import { ROLE_LABELS } from '../../constants/roles';
import { getIsoFormFileUrl } from '../../constants/isoForms';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AssignedForms() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTemplates()
      .then((res) => setTemplates(res.data.data))
      .catch(() => toast.error('Failed to load assigned forms'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assigned Forms</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {templates.length} ISO form{templates.length !== 1 ? 's' : ''} assigned to your role
        </p>
      </div>

      {templates.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assigned forms" description="No active forms are assigned to your role." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t._id} className="card-hover p-5 flex flex-col gap-3 group">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-brand-600" />
                </div>
                <span className="text-xs font-mono bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-lg">
                  #{t.formNo}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-snug">{t.title}</h3>
                {t.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Responsible: {ROLE_LABELS[user?.role] || user?.role}
                </span>
                {t.requiresHODApproval && (
                  <span className="badge bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                    HOD approval required
                  </span>
                )}
              </div>
              {t.deadline && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <Calendar size={11} /> Due: {formatDate(t.deadline)}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between gap-3">
                {getIsoFormFileUrl(t.formNo, t.sourceFile) ? (
                  <a
                    href={getIsoFormFileUrl(t.formNo, t.sourceFile)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    View source form <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">No source file uploaded</span>
                )}
                <Link
                  to={`/fill-form/${t.formNo}`}
                  className="flex items-center text-brand-600 dark:text-brand-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Submit Completed File <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
