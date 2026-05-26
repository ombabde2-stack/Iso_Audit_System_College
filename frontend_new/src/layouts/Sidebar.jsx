import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, FileText, ClipboardList, CheckSquare,
  Users, BarChart3, Settings, LogOut, ShieldCheck, PanelLeftClose, PanelLeft, BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import { ROLE_LABELS } from '../constants/roles';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard',      roles: null },
  { to: '/my-forms',      icon: FileText,        label: 'My Forms',       roles: ['faculty','classTeacher','internshipCoordinator','majorProjectCoordinator','ediCoordinator','studentActivityCoordinator','studentPortfolioAlumniCoordinator','budgetCoordinator','assistantHeadAcademics','assistantHeadResearch', 'hod'] },
  { to: '/assigned-forms',icon: ClipboardList,   label: 'Assigned Forms', roles: ['faculty','classTeacher','internshipCoordinator','majorProjectCoordinator','ediCoordinator','studentActivityCoordinator','studentPortfolioAlumniCoordinator','budgetCoordinator','assistantHeadAcademics','assistantHeadResearch', 'hod'] },
  { to: '/hod-queue',     icon: CheckSquare,     label: 'Pending Queue',  roles: ['hod'] },
  { to: '/hod-approval',  icon: ShieldCheck,     label: 'All Reviews',    roles: ['hod'] },
  { to: '/hod-research-dashboard', icon: BarChart3, label: 'Research Analytics', roles: ['hod'] },
  { to: '/admin/users',   icon: Users,           label: 'Manage Users',   roles: ['admin'] },
  { to: '/admin/reports', icon: BarChart3,       label: 'Reports',        roles: ['admin'] },
  { to: '/profile',       icon: BookOpen,        label: 'Profile',        roles: null },
  { to: '/settings',      icon: Settings,        label: 'Settings',       roles: null },
];

const MIN_WIDTH = 180;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 256;

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Resizable state
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('sidebar-width');
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      let newWidth = e.clientX;
      if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
      if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
      setWidth(newWidth);
      localStorage.setItem('sidebar-width', newWidth.toString());
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside 
      ref={sidebarRef}
      style={{ width: collapsed ? '64px' : `${width}px` }}
      className={cn(
        'relative flex flex-col h-screen flex-shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f151d]',
        !isResizing && 'transition-all duration-300'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">ISO Audit</p>
            <p className="text-xs text-slate-400 truncate">Management System</p>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={cn(
            "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium truncate">{ROLE_LABELS[user?.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleLogout} className="sidebar-link w-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400">
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Resize Handle */}
      {!collapsed && (
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-brand-500/30 active:bg-brand-500/50 transition-colors group z-50"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-0.5 bg-slate-300 dark:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </aside>
  );
}
