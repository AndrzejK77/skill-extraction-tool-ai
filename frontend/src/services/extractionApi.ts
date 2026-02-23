import type { ExtractionResult, SystemStatus } from '../types/extraction'

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

  if (response.status === 502) {
    const message = await response.text().catch(() => '')
    throw new Error(message || 'LLM request failed. Please try again later.')
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

/**
 * Fetches all extraction results, newest first.
 * Throws an error with a human-readable message on failure.
 */
export async function getAllExtractions(): Promise<ExtractionResult[]> {
  const response = await fetch(`${BASE_URL}/extractions`)

  if (!response.ok) {
    throw new Error(`Failed to load extraction history (HTTP ${response.status}).`)
  }

  return response.json() as Promise<ExtractionResult[]>
}

/**
 * Deletes an extraction result by ID.
 * Throws an error with a human-readable message on failure.
 */
export async function deleteExtraction(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/extraction/${id}`, {
    method: 'DELETE',
  })

  if (response.status === 404) {
    throw new Error(`Extraction with ID "${id}" was not found.`)
  }

  if (!response.ok) {
    throw new Error(`Failed to delete extraction (HTTP ${response.status}).`)
  }
}

/**
 * Fetches the current system status from the backend.
 * Throws an error with a human-readable message on failure.
 */
export async function getSystemStatus(): Promise<SystemStatus> {
  const response = await fetch(`${BASE_URL}/system/status`)

  if (!response.ok) {
    throw new Error(`Failed to load system status (HTTP ${response.status}).`)
  }

  return response.json() as Promise<SystemStatus>
}
