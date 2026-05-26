import { cn } from '../../utils/cn';

export default function StatsCard({ title, value, icon: Icon, color = 'brand', trend, subtitle }) {
  const colorMap = {
    brand:   { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-brand-600',   text: 'text-slate-900 dark:text-slate-100' },
    emerald: { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-emerald-600', text: 'text-slate-900 dark:text-slate-100' },
    amber:   { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-amber-500',   text: 'text-slate-900 dark:text-slate-100' },
    indigo:  { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-indigo-600',  text: 'text-slate-900 dark:text-slate-100' },
    rose:    { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-rose-600',    text: 'text-slate-900 dark:text-slate-100' },
    violet:  { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-violet-600',  text: 'text-slate-900 dark:text-slate-100' },
    slate:   { bg: 'bg-white dark:bg-[#111821]', icon: 'bg-slate-600',   text: 'text-slate-900 dark:text-slate-100' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={cn('stat-card', c.bg)}>
      <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', c.icon)}>
        {Icon && <Icon size={22} className="text-white" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
        <p className={cn('text-2xl font-bold mt-0.5', c.text)}>{value ?? '—'}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
