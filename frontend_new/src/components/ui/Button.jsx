import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-900/10',
  secondary: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
  danger:    'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
  ghost:     'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  outline:   'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
  success:   'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
};

const sizes = {
  xs:  'px-2.5 py-1 text-xs rounded-lg',
  sm:  'px-3 py-1.5 text-sm rounded-lg',
  md:  'px-4 py-2.5 text-sm rounded-lg',
  lg:  'px-5 py-3 text-base rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-1 dark:focus:ring-offset-[#0b0f14]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon && <Icon size={15} />}
      {children}
      {!loading && IconRight && <IconRight size={15} />}
    </button>
  );
}
