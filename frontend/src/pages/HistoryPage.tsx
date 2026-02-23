import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllExtractions } from '../services/extractionApi'
import type { ExtractionResult } from '../types/extraction'

export default function HistoryPage() {
  const navigate = useNavigate()

  const [extractions, setExtractions] = useState<ExtractionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllExtractions()
      .then(setExtractions)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load extraction history.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Extraction History</h1>
      <p className="text-gray-500 mb-6">Previous skill extractions.</p>

      {loading && (
        <div className="flex items-center gap-3 text-gray-500">
          <span className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading history…
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Timestamp', 'CV File', 'IFU File', ''].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {extractions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 italic">
                    No extractions yet. Upload a CV and IFU to get started.
                  </td>
                </tr>
              ) : (
                extractions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700">{item.cvFileName}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{item.ifuFileName}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/results/${item.id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}