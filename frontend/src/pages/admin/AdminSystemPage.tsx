import { useEffect, useState } from 'react'
import { getSystemStatus } from '../../services/extractionApi'
import type { SystemStatus } from '../../types/extraction'

function StatusIndicator({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${
          ok ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className={`text-sm font-medium ${ok ? 'text-green-700' : 'text-red-700'}`}>
        {label}
      </span>
    </div>
  )
}

export default function AdminSystemPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSystemStatus()
      .then(setStatus)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load system status.')
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">System Status</h1>
      <p className="text-gray-500 mb-6">
        Current health of the backend and connected services.
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg
            className="animate-spin h-4 w-4 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading status...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {status && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-600">API Status</span>
            <StatusIndicator ok={status.apiStatus === 'OK'} label={status.apiStatus} />
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-600">Database Connected</span>
            <StatusIndicator ok={status.databaseConnected} label={status.databaseConnected ? 'Connected' : 'Disconnected'} />
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-600">LLM Configured</span>
            <StatusIndicator ok={status.llmConfigured} label={status.llmConfigured ? 'Configured' : 'Not configured'} />
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-600">Last Checked</span>
            <span className="text-sm text-gray-500">
              {new Date(status.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
