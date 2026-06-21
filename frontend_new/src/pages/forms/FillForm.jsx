import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, ShieldCheck, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyTemplate } from '../../api/formTemplate.api';
import { createForm } from '../../api/forms.api';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { FORM_NUMBERS } from '../../constants/formNumbers';
import { getIsoFormFileUrl } from '../../constants/isoForms';
import { useAuth } from '../../context/AuthContext';

const getAcceptedExtension = (sourceFile = '') => {
  const match = sourceFile.match(/\.[a-z0-9]+$/i);
  return match?.[0]?.toLowerCase() || '';
};

export default function FillForm() {
  const { formNo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!formNo) {
      setLoading(false);
      return;
    }

    getMyTemplate(formNo)
      .then((res) => {
        const data = res.data.data;
        setTemplate(data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Could not load form');
        setTemplate(null);
      })
      .finally(() => setLoading(false));
  }, [formNo]);

  const formTitle = template?.title || FORM_NUMBERS[formNo] || `Form #${formNo}`;
  const sourceFormUrl = getIsoFormFileUrl(formNo, template?.sourceFile);
  const requiredExtension = useMemo(() => getAcceptedExtension(template?.sourceFile), [template?.sourceFile]);

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (!user?.signatureUrl) {
      toast.error('Please upload your digital signature in your profile before submitting.');
      navigate('/profile');
      return;
    }

    if (!submissionFile) {
      toast.error('Please upload the completed reference form file.');
      return;
    }

    const uploadedExtension = submissionFile.name.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase() || '';
    if (requiredExtension && uploadedExtension !== requiredExtension) {
      toast.error(`Please upload the completed form in ${requiredExtension} format.`);
      return;
    }

    setSubmitting(true);
    try {
      await createForm({
        formType: template?.formNo || formNo,
        submissionFile,
      });
      toast.success('Document submitted successfully.');
      navigate('/my-forms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!template) {
    return <div className="text-center py-20 text-slate-400">Assigned form not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-slide-up pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-5 transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
            <FileText size={22} className="text-brand-600" />
          </div>
          <div>
            <span className="text-xs font-mono bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded mb-1 inline-block">
              #{template?.formNo || formNo}
            </span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{formTitle}</h2>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-4">
          <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <ShieldCheck size={16} className="mt-0.5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                Institutional Quality Management Protocol
              </p>
              <p className="mt-1">
                Download the assigned template, complete it, sign it, and upload the finished document for ISO audit evidence.
              </p>
            </div>
          </div>
        </div>

        {!user?.signatureUrl && (
          <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-rose-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-800 dark:text-rose-200">Digital Signature Required</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                You haven't uploaded a digital signature to your profile. For ISO compliance, all submissions must be digitally signed.
              </p>
              <Link 
                to="/profile" 
                className="inline-block mt-3 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 underline underline-offset-4"
              >
                Go to Profile to Upload Signature →
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={onFormSubmit} className="space-y-8">
          {/* Document Evidence Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <FileText size={18} />
              <h3 className="font-bold">Document Evidence</h3>
            </div>
            
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Download Template</p>
                  <p className="text-slate-500 mt-0.5">Required format: {requiredExtension || 'same as assigned'}</p>
                </div>
                {sourceFormUrl && (
                  <a
                    href={sourceFormUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium rounded-xl transition-colors"
                  >
                    <Download size={14} /> Download
                  </a>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Upload Signed/Completed Document <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept={requiredExtension || '.doc,.docx,.xls,.xlsx'}
                  onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                  className="input-base file:mr-4 file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-700"
                />
                {submissionFile && (
                  <p className="text-xs text-emerald-600 font-medium">Selected: {submissionFile.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="submit" loading={submitting} icon={Upload} className="flex-1" size="lg">
              Submit Document
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
