import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center animate-slide-up">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6">
          <AlertTriangle size={36} className="text-rose-400"/>
        </div>
        <h1 className="text-6xl font-bold text-gradient mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm">
          <Home size={16}/> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
