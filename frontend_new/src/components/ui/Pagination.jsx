import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={16} />
      </button>
      {nums.map((n) => (
        <button key={n} onClick={() => onPage(n)}
          className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${n === page ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
          {n}
        </button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page >= pages} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
