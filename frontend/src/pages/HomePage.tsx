import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadExtraction } from '../services/extractionApi'

export default function HomePage() {
  const navigate = useNavigate()

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [ifuFile, setIfuFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!cvFile || !ifuFile) {
      setError('Please select both a CV and an IFU document.')
      return
    }

    setLoading(true)
    try {
      const id = await uploadExtraction(cvFile, ifuFile)
      navigate(`/results/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Documents</h1>
      <p className="text-gray-500 mb-6">
        Upload a CV and an IFU document to extract skills using AI.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CV Document
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            disabled={loading}
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-2 bg-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">PDF or DOCX only</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IFU Document
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            disabled={loading}
            onChange={(e) => setIfuFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-2 bg-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">PDF or DOCX only</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Extracting…
            </>
          ) : (
            'Extract Skills'
          )}
        </button>
      </form>
    </div>
  )
}
