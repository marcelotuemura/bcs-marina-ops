export default function StatCard({ label, value, change, tone = 'neutral' }: { label: string; value: string; change?: string; tone?: string }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-topline"><span>{label}</span><span className="stat-dot" /></div>
      <strong>{value}</strong>
      {change && <small>{change}</small>}
    </div>
  )
}
