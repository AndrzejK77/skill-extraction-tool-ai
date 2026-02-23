export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Extractions', value: '—' },
    { label: 'Database', value: '—' },
    { label: 'LLM Status', value: '—' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Overview of all extractions and system health.</p>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-300 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 italic">
        Live data will load here once API integration is implemented.
      </p>
    </div>
  )
}
