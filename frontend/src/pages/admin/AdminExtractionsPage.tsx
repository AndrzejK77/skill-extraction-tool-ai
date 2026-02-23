import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllExtractions, deleteExtraction } from '../../services/extractionApi'
import type { ExtractionResult } from '../../types/extraction'

export default function AdminExtractionsPage() {
  const navigate = useNavigate()

  const [extractions, setExtractions] = useState<ExtractionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    getAllExtractions()
      .then(setExtractions)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load extractions.')
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this extraction? This cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      await deleteExtraction(id)
      setExtractions((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete extraction.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">All Extractions</h1>
      <p className="text-gray-500 mb-6">Manage and review all extraction results.</p>

      {loading && (
        <div className="flex items-center gap-3 text-gray-500">
          <span className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading extractions…
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Timestamp', 'CV File', 'IFU File', 'Actions'].map((h) => (
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
                    No extractions found.
                  </td>
                </tr>
              ) : (
                extractions.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      deletingId === item.id ? 'opacity-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700">{item.cvFileName}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{item.ifuFileName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => navigate(`/results/${item.id}`)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === item.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
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
