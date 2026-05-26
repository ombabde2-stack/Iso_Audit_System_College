import { FileSpreadsheet, FileText } from 'lucide-react';

export default function SourceFormPreview({ preview }) {
  if (!preview) return null;

  const Icon = preview.sourceType === 'xlsx' ? FileSpreadsheet : FileText;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
          <Icon size={18} className="text-brand-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Extracted Source Structure</h3>
          <p className="text-xs text-slate-500">Preview generated from the uploaded {preview.sourceType?.toUpperCase() || 'form'} file.</p>
        </div>
      </div>

      {preview.headings?.length > 0 && (
        <div className="space-y-1">
          {preview.headings.map((line, index) => (
            <p key={`${line}-${index}`} className={`${index === 0 ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-sm text-slate-600 dark:text-slate-300'}`}>
              {line}
            </p>
          ))}
        </div>
      )}

      {preview.tables?.length > 0 && (
        <div className="space-y-4">
          {preview.tables.map((table, index) => (
            <div key={table.id || index} className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-sm">
                <tbody>
                  {table.rows?.map((row, rowIndex) => (
                    <tr key={`${table.id}-${rowIndex}`} className="border-b last:border-b-0 border-slate-200 dark:border-slate-800">
                      {row.map((cell, cellIndex) => (
                        <td key={`${table.id}-${rowIndex}-${cellIndex}`} className="px-3 py-2 align-top text-slate-600 dark:text-slate-300">
                          {cell || ' '}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
