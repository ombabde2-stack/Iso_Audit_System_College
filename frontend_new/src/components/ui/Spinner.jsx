import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 16, md: 24, lg: 36 }[size] || 24;
  return <Loader2 size={s} className={`animate-spin text-brand-500 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
