import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy'); }
  catch { return '—'; }
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy, hh:mm a'); }
  catch { return '—'; }
};

export const timeAgo = (date) => {
  if (!date) return '—';
  try { return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }); }
  catch { return '—'; }
};

export const STATUS_CONFIG = {
  PENDING:  { label: 'Pending',  cls: 'badge-pending',  dot: 'bg-amber-400' },
  APPROVED: { label: 'Approved', cls: 'badge-approved', dot: 'bg-emerald-400' },
  REJECTED: { label: 'Rejected', cls: 'badge-rejected', dot: 'bg-rose-400' },
  DRAFT:    { label: 'Draft',    cls: 'badge-draft',    dot: 'bg-slate-400' },
  RETURNED: { label: 'Returned', cls: 'badge-returned', dot: 'bg-orange-400' },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.DRAFT;

export const truncate = (str, n = 40) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
