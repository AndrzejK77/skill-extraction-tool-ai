import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getExtractionById } from '../services/extractionApi'
import type { ExtractionResult } from '../types/extraction'

function SkillSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-100"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()

  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    getExtractionById(id)
      .then(setResult)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load extraction result.')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <span className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Loading extraction results…
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          {error}
        </div>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Upload
        </Link>
      </div>
    )
  }

  if (!result) return null

  const skills = result.skills

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Extraction Results</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(result.timestamp).toLocaleString()} &mdash;{' '}
            <span className="font-mono">{result.cvFileName}</span> &amp;{' '}
            <span className="font-mono">{result.ifuFileName}</span>
          </p>
        </div>
        <Link to="/" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
          ← New extraction
        </Link>
      </div>

      {skills ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <SkillSection title="Technical Skills" items={skills.technicalSkills} />
          <SkillSection title="Soft Skills" items={skills.softSkills} />
          <SkillSection title="Tools" items={skills.tools} />
          <SkillSection title="Experience Areas" items={skills.experienceAreas} />

          {skills.technicalSkills.length === 0 &&
            skills.softSkills.length === 0 &&
            skills.tools.length === 0 &&
            skills.experienceAreas.length === 0 && (
              <p className="text-sm text-gray-400 italic">No skills were extracted.</p>
            )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-400 italic">
            No skill data available for this extraction.
          </p>
        </div>
      )}
    </div>
  )
}
