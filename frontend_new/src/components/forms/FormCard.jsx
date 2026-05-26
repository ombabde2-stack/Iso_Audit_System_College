import { Link } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate, truncate } from '../../utils/formatters';

export default function FormCard({ form }) {
  return (
    <Link to={`/forms/${form._id}`} className="card-hover block p-4 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-brand-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              Form #{form.formType}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{truncate(form.formTitle, 45)}</p>
          </div>
        </div>
        <Badge status={form.status} />
      </div>
      {form.remarks && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/70 rounded-lg px-3 py-2 line-clamp-2">
          {form.remarks}
        </p>
      )}
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <Clock size={11} />
        {formatDate(form.createdAt)}
      </div>
    </Link>
  );
}
