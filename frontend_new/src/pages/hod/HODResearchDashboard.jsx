import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getResearchAnalytics } from '../../api/dashboard.api';
import StatsCard from '../../components/charts/StatsCard';
import StatusPieChart from '../../components/charts/StatusPieChart';
import MonthlyBarChart from '../../components/charts/MonthlyBarChart';
import { CardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function HODResearchDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResearchAnalytics()
      .then((res) => setData(res.data.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load research analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-slate-400">Failed to load research analytics</div>;
  }

  const { research, overview, placement, trends } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="card p-6 bg-slate-900 text-white dark:bg-[#111821] dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
              <BookOpen size={16} /> Research Analytics Dashboard
            </p>
            <h2 className="text-2xl font-bold mt-0.5">{user?.department}</h2>
            <p className="text-slate-400 text-sm mt-1">
              {research?.approvedResearch || 0} approved research submissions | {research?.uniqueFacultyContributors || 0} contributors
            </p>
          </div>
          <Link to="/hod-queue">
            <Button variant="secondary" size="sm" icon={Filter}>
              View All Forms
            </Button>
          </Link>
        </div>
      </div>

      {/* Research Focus Stats */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp size={16} /> Research Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Research Forms"
            value={research?.totalResearchForms ?? 0}
            icon={FileText}
            color="indigo"
            subtitle="All types"
          />
          <StatsCard
            title="Approved Research"
            value={research?.approvedResearch ?? 0}
            icon={CheckCircle}
            color="emerald"
            subtitle="Published"
          />
          <StatsCard
            title="Pending Approval"
            value={research?.pendingResearchApproval ?? 0}
            icon={Clock}
            color="amber"
            subtitle="Awaiting review"
          />
          <StatsCard
            title="Faculty Contributors"
            value={research?.uniqueFacultyContributors ?? 0}
            icon={Users}
            color="violet"
            subtitle="Active contributors"
          />
        </div>
      </div>

      {/* Research Form Type Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <BarChart3 size={16} /> Research Form Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Faculty Research Activity</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{research?.facultyResearchActivityCount ?? 0}</p>
                <p className="text-xs text-slate-400 mt-1">Form 126</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Research Activity Report</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{research?.researchActivityReportCount ?? 0}</p>
                <p className="text-xs text-slate-400 mt-1">Form 179</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Innovation & Patents</p>
                <p className="text-3xl font-bold text-violet-600 mt-2">{research?.innovationPatentCount ?? 0}</p>
                <p className="text-xs text-slate-400 mt-1">Form 180</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-950/30 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-violet-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Department Stats */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <BarChart3 size={16} /> Department-Wide Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard
            title="Total Forms"
            value={overview?.totalForms ?? 0}
            icon={FileText}
            color="brand"
          />
          <StatsCard
            title="Approved"
            value={overview?.approvedForms ?? 0}
            icon={CheckCircle}
            color="emerald"
          />
          <StatsCard
            title="Pending"
            value={overview?.pendingForms ?? 0}
            icon={Clock}
            color="amber"
          />
          <StatsCard
            title="Rejected"
            value={overview?.rejectedForms ?? 0}
            icon={AlertCircle}
            color="rose"
          />
          <StatsCard
            title="Returned"
            value={overview?.returnedForms ?? 0}
            icon={AlertCircle}
            color="slate"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Department Form Status</h3>
          <StatusPieChart
            data={{
              PENDING: overview?.pendingForms,
              APPROVED: overview?.approvedForms,
              REJECTED: overview?.rejectedForms,
            }}
          />
        </div>

        {/* Monthly Trends */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Monthly Research Submissions</h3>
          <MonthlyBarChart data={trends?.monthlyResearchSubmissions || []} />
        </div>
      </div>

      {/* Smart Budget Analysis (New Intelligence Feature) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <BarChart3 size={18} />
                <h3 className="font-bold">Smart Budget Intelligence</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">{data?.budget?.totalItems || 0}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Total Items Requested</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-600">{data?.budget?.totalQuantity || 0}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Total Quantity</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Aggregated in real-time from Form 114 (Budget Proposal) dynamic data.
              </p>
            </div>
          </div>
        </div>

        {/* Smart Placement Intelligence */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Smart Placement Intelligence</h3>
              <p className="text-xs text-slate-500">Extracted from Form 815</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Placed</p>
              <p className="text-2xl font-bold text-indigo-600">{placement?.totalPlaced || 0}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Highest PKG</p>
              <p className="text-2xl font-bold text-indigo-600">{placement?.highestPackage || 0}L</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Higher Ed</p>
              <p className="text-2xl font-bold text-indigo-600">{placement?.totalHigherStudies || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/hod-queue">
            <Button fullWidth variant="outline" size="sm">
              Review Pending Forms
            </Button>
          </Link>
          <Link to="/assigned-forms">
            <Button fullWidth variant="outline" size="sm">
              View Assigned Forms
            </Button>
          </Link>
          <a href="#export">
            <Button fullWidth variant="outline" size="sm">
              Export Report
            </Button>
          </a>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>
            This dashboard displays research analytics for your department. Data is updated in real-time as faculty submit and update forms.
          </span>
        </p>
      </div>
    </div>
  );
}
