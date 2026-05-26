import { useEffect, useState } from 'react';
import { BarChart3, FileText, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminFormStats } from '../../api/admin.api';
import { getDashboard } from '../../api/dashboard.api';
import StatsCard from '../../components/charts/StatsCard';
import StatusPieChart from '../../components/charts/StatusPieChart';
import MonthlyBarChart from '../../components/charts/MonthlyBarChart';
import { CardSkeleton } from '../../components/ui/Skeleton';

export default function AdminReports() {
  const [dashboard, setDashboard] = useState(null);
  const [formStats, setFormStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getAdminFormStats({})])
      .then(([dash, stats]) => { setDashboard(dash.data.data); setFormStats(stats.data.data); })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><CardSkeleton key={i}/>)}</div>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl font-bold">Reports & Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">System-wide audit insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={dashboard?.totalUsers} icon={Users} color="brand"/>
        <StatsCard title="Total Forms" value={dashboard?.forms?.total} icon={FileText} color="violet"/>
        <StatsCard title="Pending" value={dashboard?.forms?.pending} icon={TrendingUp} color="amber"/>
        <StatsCard title="Approved" value={dashboard?.forms?.approved} icon={BarChart3} color="emerald"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Global Status Distribution</h3>
          <StatusPieChart data={{ PENDING: dashboard?.forms?.pending, APPROVED: dashboard?.forms?.approved, REJECTED: dashboard?.forms?.rejected }}/>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Monthly Submissions</h3>
          <MonthlyBarChart data={dashboard?.monthlyStats || []}/>
        </div>
      </div>

      {/* Department breakdown */}
      {formStats?.byDepartment?.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold">Department-wise Breakdown</h3>
          </div>
          <table className="table-base">
            <thead><tr><th>Department</th><th>Total</th><th>Pending</th><th>Approved</th></tr></thead>
            <tbody>
              {formStats.byDepartment.map((d) => (
                <tr key={d._id}>
                  <td className="font-medium">{d._id}</td>
                  <td>{d.total}</td>
                  <td><span className="badge-pending">{d.pending}</span></td>
                  <td><span className="badge-approved">{d.approved}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Top forms */}
      {formStats?.byFormType?.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold">Most Submitted Forms</h3>
          </div>
          <table className="table-base">
            <thead><tr><th>Form No.</th><th>Submissions</th></tr></thead>
            <tbody>
              {formStats.byFormType.map((f) => (
                <tr key={f._id}>
                  <td className="font-mono text-brand-600 dark:text-brand-400 font-semibold">#{f._id}</td>
                  <td>{f.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
