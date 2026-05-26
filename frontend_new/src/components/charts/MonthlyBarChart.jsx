import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function MonthlyBarChart({ data = [] }) {
  if (!data.length) {
    return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No monthly data yet</div>;
  }

  const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = data.map((d) => ({
    month: `${MONTHS[d._id?.month]} ${d._id?.year}`,
    submissions: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--surface-tooltip)',
            border: '1px solid var(--border-tooltip)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-tooltip)',
          }}
          cursor={{ fill: 'rgba(99,102,241,0.08)' }}
        />
        <Bar dataKey="submissions" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
