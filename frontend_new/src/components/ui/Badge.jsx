import { getStatusConfig } from '../../utils/formatters';

export default function Badge({ status, children }) {
  if (children) return <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{children}</span>;
  const cfg = getStatusConfig(status);
  return (
    <span className={cfg.cls}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
