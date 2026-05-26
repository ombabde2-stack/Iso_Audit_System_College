import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES = {
  '/':               'Dashboard',
  '/my-forms':       'My Submissions',
  '/assigned-forms': 'Assigned Forms',
  '/hod-queue':      'Pending Approval Queue',
  '/hod-approval':   'All Reviews',
  '/admin/users':    'Manage Users',
  '/admin/reports':  'Reports & Analytics',
  '/profile':        'My Profile',
  '/settings':       'Settings',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[1] || 'ISO Audit System';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#0b0f14]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar pageTitle={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
