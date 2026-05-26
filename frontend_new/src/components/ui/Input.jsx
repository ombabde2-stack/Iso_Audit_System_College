import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-base',
            Icon && 'pl-9',
            error && 'input-error',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

export default Input;
