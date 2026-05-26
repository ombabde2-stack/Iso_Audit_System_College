import { getInitials } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const COLORS = [
  'bg-violet-600', 'bg-blue-600', 'bg-emerald-600',
  'bg-amber-600', 'bg-rose-600', 'bg-indigo-600',
];

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const sizeMap = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  const color = COLORS[name.charCodeAt(0) % COLORS.length];

  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover ring-2 ring-white dark:ring-slate-800', sizeMap[size], className)} />;
  }
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-slate-800', color, sizeMap[size], className)}>
      {getInitials(name)}
    </div>
  );
}
