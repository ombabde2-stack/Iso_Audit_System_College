import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <div className="max-w-lg mx-auto animate-slide-up space-y-5">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your preferences</p>
      </div>
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Appearance</h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={18} className="text-brand-400"/> : <Sun size={18} className="text-amber-500"/>}
            <div>
              <p className="text-sm font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
              <p className="text-xs text-slate-400">Currently using {theme} theme</p>
            </div>
          </div>
          <ThemeToggle/>
        </div>
      </div>
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">About</h3>
        <div className="text-sm text-slate-500 space-y-1">
          <p>Smart ISO Audit Management System</p>
          <p>Version 1.0.0 · Engineering College</p>
          <p className="text-xs mt-2 text-slate-400">Built with React + Vite + Tailwind + Express + MongoDB</p>
        </div>
      </div>
    </div>
  );
}
