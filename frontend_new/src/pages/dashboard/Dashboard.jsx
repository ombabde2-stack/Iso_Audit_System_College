import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboard } from '../../api/dashboard.api';
import StatsCard from '../../components/charts/StatsCard';
import StatusPieChart from '../../components/charts/StatusPieChart';
import MonthlyBarChart from '../../components/charts/MonthlyBarChart';
import FormCard from '../../components/forms/FormCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { ROLE_LABELS } from '../../constants/roles';
import toast from 'react-hot-toast';

function DashboardHeader({ eyebrow, title, meta, action }) {
  return (
    <div className="card p-6 bg-slate-900 text-white dark:bg-[#111821] dark:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-300">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight truncate">{title}</h2>
          {meta && <p className="mt-1 text-sm text-slate-400">{meta}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (user?.role !== 'hod' && user?.role !== 'admin') {
    return (
      <div className="space-y-6 animate-slide-up">
        <DashboardHeader
          eyebrow="Welcome back"
          title={user?.name}
          meta={`${ROLE_LABELS[user?.role]} | ${user?.department}`}
          action={(
            <Link to="/fill-form">
              <Button variant="secondary" size="sm" icon={Plus}>New Form</Button>
            </Link>
          )}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Total Submitted" value={data?.totalSubmitted ?? 0} icon={FileText} color="brand" />
          <StatsCard title="Pending" value={data?.pending ?? 0} icon={Clock} color="amber" />
          <StatsCard title="Approved" value={data?.approved ?? 0} icon={CheckCircle} color="emerald" />
          <StatsCard title="Rejected" value={data?.rejected ?? 0} icon={XCircle} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Status Breakdown</h3>
            <StatusPieChart data={{ PENDING: data?.pending, APPROVED: data?.approved, REJECTED: data?.rejected, DRAFT: data?.draft }} />
          </div>

          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Submissions</h3>
              <Link to="/my-forms" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">View all</Link>
            </div>
            {data?.recentForms?.length ? (
              <div className="grid gap-3">
                {data.recentForms.map((f) => <FormCard key={f._id} form={f} />)}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                No submissions yet. <Link to="/assigned-forms" className="text-brand-500 underline">Submit a form</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'hod') {
    return (
      <div className="space-y-6 animate-slide-up">
        <DashboardHeader
          eyebrow="HOD Dashboard"
          title={user?.department}
          meta={`${data?.pendingApproval ?? 0} forms awaiting approval`}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Total Forms" value={data?.totalForms ?? 0} icon={FileText} color="brand" />
          <StatsCard title="Pending Approval" value={data?.pendingApproval ?? 0} icon={AlertCircle} color="amber" />
          <StatsCard title="Approved" value={data?.approved ?? 0} icon={CheckCircle} color="emerald" />
          <StatsCard title="Rejected" value={data?.rejected ?? 0} icon={XCircle} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Department Status</h3>
            <StatusPieChart data={{ PENDING: data?.pendingApproval, APPROVED: data?.approved, REJECTED: data?.rejected }} />
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Submissions</h3>
              <Link to="/hod-queue" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">View queue</Link>
            </div>
            <div className="space-y-2">
              {data?.recentForms?.map((f) => <FormCard key={f._id} form={f} />) || (
                <p className="text-sm text-slate-400 text-center py-4">No recent forms</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <DashboardHeader
        eyebrow="Admin Dashboard"
        title="System Overview"
        meta={`${data?.totalUsers ?? 0} users | ${data?.forms?.total ?? 0} total forms`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={data?.totalUsers ?? 0} icon={FileText} color="brand" />
        <StatsCard title="Total Forms" value={data?.forms?.total ?? 0} icon={BarChart3} color="violet" />
        <StatsCard title="Pending" value={data?.forms?.pending ?? 0} icon={Clock} color="amber" />
        <StatsCard title="Approved" value={data?.forms?.approved ?? 0} icon={CheckCircle} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Global Status Distribution</h3>
          <StatusPieChart data={{ PENDING: data?.forms?.pending, APPROVED: data?.forms?.approved, REJECTED: data?.forms?.rejected }} />
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Monthly Submissions</h3>
          <MonthlyBarChart data={data?.monthlyStats || []} />
        </div>
      </div>
    </div>
  );
}
