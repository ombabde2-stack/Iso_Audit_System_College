import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2, TableProperties } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const getError = (errors, path) =>
  path.split('.').reduce((current, key) => current?.[key], errors);

function DynamicField({ field, register, errors, path }) {
  const error = getError(errors, path)?.message;

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {field.label}
          {field.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <textarea
          className={`input-base min-h-[96px] resize-y ${error ? 'input-error' : ''}`}
          placeholder={field.placeholder}
          {...register(path, { required: field.required ? `${field.label} is required` : false })}
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {field.label}
          {field.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <select
          className={`input-base ${error ? 'input-error' : ''}`}
          {...register(path, { required: field.required ? `${field.label} is required` : false })}
        >
          <option value="">Select {field.label}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }

  return (
    <Input
      label={field.label}
      type={field.type || 'text'}
      placeholder={field.placeholder}
      error={error}
      {...register(path, { required: field.required ? `${field.label} is required` : false })}
      required={field.required}
    />
  );
}

function TableSection({ section, control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.name,
  });

  useEffect(() => {
    if (!fields.length) {
      const emptyRow = Object.fromEntries(section.columns.map((column) => [column.name, '']));
      append(emptyRow);
    }
  }, [append, fields.length, section.columns]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
            <TableProperties size={16} className="text-brand-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{section.title}</h3>
            <p className="text-xs text-slate-500">Add one or more rows from the source register/table.</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={() => append(Object.fromEntries(section.columns.map((column) => [column.name, ''])))}
        >
          Add Row
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((item, rowIndex) => (
          <div key={item.id} className="rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Row {rowIndex + 1}</p>
              <button
                type="button"
                onClick={() => remove(rowIndex)}
                disabled={fields.length <= (section.minRows || 1)}
                className="inline-flex items-center gap-1 text-xs text-rose-500 disabled:opacity-40"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.columns.map((column) => (
                <DynamicField
                  key={`${item.id}-${column.name}`}
                  field={column}
                  register={register}
                  errors={errors}
                  path={`${section.name}.${rowIndex}.${column.name}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DynamicFormRenderer({ sections = [], register, errors, control }) {
  return (
    <div className="space-y-5">
      {sections.map((section) => {
        if (section.type === 'table') {
          return (
            <TableSection
              key={section.id}
              section={section}
              control={control}
              register={register}
              errors={errors}
            />
          );
        }

        return (
          <div key={section.id} className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{section.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Captured from the configured ISO form template.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(section.fields || []).map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                  path={field.name}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
