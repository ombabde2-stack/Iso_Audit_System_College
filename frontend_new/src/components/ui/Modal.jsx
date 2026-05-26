import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${sizeMap[size]} bg-white dark:bg-[#111821] rounded-lg shadow-2xl animate-slide-up border border-slate-200 dark:border-slate-700`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-4">{children}</div>
        {/* Footer */}
        {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  );
}
