import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f14] bg-grid flex flex-col">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-sm">ISO Audit System</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="relative card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center mb-4">
                <ShieldCheck size={26} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
              {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {children}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Smart ISO Audit Management System · Engineering College
          </p>
        </div>
      </div>
    </div>
  );
}
