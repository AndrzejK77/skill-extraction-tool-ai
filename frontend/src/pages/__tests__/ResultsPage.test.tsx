import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import type { ExtractionResult } from '../../types/extraction'
import * as api from '../../services/extractionApi'
import ResultsPage from '../ResultsPage'

vi.mock('../../services/extractionApi', () => ({
  getExtractionById: vi.fn(),
}))

const mockResult: ExtractionResult = {
  id: 'test-id-123',
  timestamp: '2026-02-23T12:00:00Z',
  cvFileName: 'cv.docx',
  ifuFileName: 'ifu.docx',
  skills: {
    technicalSkills: ['C#', '.NET'],
    softSkills: ['Communication'],
    tools: ['Git'],
    experienceAreas: ['Backend Development'],
  },
}

function renderResultsPage(id = 'test-id-123') {
  return render(
    <MemoryRouter initialEntries={[`/results/${id}`]}>
      <Routes>
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ResultsPage', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows loading state initially', () => {
    vi.mocked(api.getExtractionById).mockReturnValue(new Promise(() => {})) // never resolves
    renderResultsPage()
    expect(screen.getByText(/loading extraction results/i)).toBeInTheDocument()
  })

  it('displays extracted skill tags after data loads', async () => {
    vi.mocked(api.getExtractionById).mockResolvedValue(mockResult)
    renderResultsPage()

    await waitFor(() => {
      expect(screen.getByText('C#')).toBeInTheDocument()
    })

    expect(screen.getByText('.NET')).toBeInTheDocument()
    expect(screen.getByText('Communication')).toBeInTheDocument()
    expect(screen.getByText('Git')).toBeInTheDocument()
    expect(screen.getByText('Backend Development')).toBeInTheDocument()
  })

  it('displays file names after data loads', async () => {
    vi.mocked(api.getExtractionById).mockResolvedValue(mockResult)
    renderResultsPage()

    await waitFor(() => {
      expect(screen.getByText('cv.docx')).toBeInTheDocument()
    })
    expect(screen.getByText('ifu.docx')).toBeInTheDocument()
  })

  it('shows error message when API call fails', async () => {
    vi.mocked(api.getExtractionById).mockRejectedValue(new Error('Extraction not found.'))
    renderResultsPage()

    await waitFor(() => {
      expect(screen.getByText('Extraction not found.')).toBeInTheDocument()
    })
  })
})
