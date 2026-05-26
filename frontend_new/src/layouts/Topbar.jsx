import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import ThemeToggle from '../components/ui/ThemeToggle';
import { ROLE_LABELS } from '../constants/roles';
import { Link } from 'react-router-dom';

export default function Topbar({ pageTitle }) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center gap-4 flex-shrink-0 dark:border-slate-800 dark:bg-[#0f151d]">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-800 dark:text-white truncate">{pageTitle}</h1>
        {user?.department && (
          <p className="text-xs text-slate-400 truncate">{user.department}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification bell placeholder */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={18} className="text-slate-500 dark:text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* User avatar link */}
        <Link to="/profile">
          <Avatar name={user?.name} size="sm" />
        </Link>
      </div>
    </header>
  );
}
