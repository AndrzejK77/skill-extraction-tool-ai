export default function AdminSystemPage() {
  const rows = [
    { label: 'API Status', value: '—' },
    { label: 'Database Connected', value: '—' },
    { label: 'LLM Configured', value: '—' },
    { label: 'Timestamp', value: '—' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">System Status</h1>
      <p className="text-gray-500 mb-6">
        Current health of the backend and connected services.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 shadow-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-medium text-gray-400">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3 italic">
        Live data will load here once API integration is implemented.
      </p>
    </div>
  )
}
