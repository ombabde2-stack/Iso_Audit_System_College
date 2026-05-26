import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', className = '', id, ...props },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn('input-base', error && 'input-error', className)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export default Select;
