import type { ExtractionResult } from '../types/extraction'

const BASE_URL = '/api'

/**
 * Uploads CV and IFU files and triggers skill extraction.
 * Returns the new extraction ID on success.
 * Throws an error with a human-readable message on failure.
 */
export async function uploadExtraction(cvFile: File, ifuFile: File): Promise<string> {
  const body = new FormData()
  body.append('cvFile', cvFile)
  body.append('ifuFile', ifuFile)

  const response = await fetch(`${BASE_URL}/extraction`, {
    method: 'POST',
    body,
  })

  if (response.status === 415) {
    throw new Error('Unsupported file type. Please upload PDF or DOCX files only.')
  }

  if (!response.ok) {
    throw new Error(`Upload failed (HTTP ${response.status}). Please try again.`)
  }

  const data = (await response.json()) as ExtractionResult
  return data.id
}

/**
 * Fetches a single extraction result by ID.
 * Throws an error with a human-readable message on failure.
 */
export async function getExtractionById(id: string): Promise<ExtractionResult> {
  const response = await fetch(`${BASE_URL}/extraction/${id}`)

  if (response.status === 404) {
    throw new Error(`Extraction with ID "${id}" was not found.`)
  }

  if (!response.ok) {
    throw new Error(`Failed to load extraction (HTTP ${response.status}).`)
  }

  return response.json() as Promise<ExtractionResult>
}
