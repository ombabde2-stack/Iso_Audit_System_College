import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  APPROVED: '#059669',
  PENDING:  '#d97706',
  REJECTED: '#e11d48',
  DRAFT:    '#64748b',
  RETURNED: '#ea580c',
};

export default function StatusPieChart({ data = {} }) {
  const chartData = Object.entries(data)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#6366f1'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--surface-tooltip)',
            color: 'var(--text-tooltip)',
            border: '1px solid var(--border-tooltip)',
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v) => [v, '']}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
