import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import type { ExtractionResult } from '../../types/extraction'
import * as api from '../../services/extractionApi'
import HistoryPage from '../HistoryPage'

vi.mock('../../services/extractionApi', () => ({
  getAllExtractions: vi.fn(),
}))

const mockExtractions: ExtractionResult[] = [
  {
    id: 'id-1',
    timestamp: '2026-02-23T10:00:00Z',
    cvFileName: 'cv_alice.docx',
    ifuFileName: 'ifu_product.docx',
    skills: null,
  },
  {
    id: 'id-2',
    timestamp: '2026-02-23T11:00:00Z',
    cvFileName: 'cv_bob.pdf',
    ifuFileName: 'ifu_device.pdf',
    skills: null,
  },
]

function renderHistoryPage() {
  return render(
    <MemoryRouter>
      <HistoryPage />
    </MemoryRouter>
  )
}

describe('HistoryPage', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows empty state message when no extractions exist', async () => {
    vi.mocked(api.getAllExtractions).mockResolvedValue([])
    renderHistoryPage()

    await waitFor(() => {
      expect(
        screen.getByText(/no extractions yet/i)
      ).toBeInTheDocument()
    })
  })

  it('displays a row for each extraction', async () => {
    vi.mocked(api.getAllExtractions).mockResolvedValue(mockExtractions)
    renderHistoryPage()

    await waitFor(() => {
      expect(screen.getByText('cv_alice.docx')).toBeInTheDocument()
    })

    expect(screen.getByText('ifu_product.docx')).toBeInTheDocument()
    expect(screen.getByText('cv_bob.pdf')).toBeInTheDocument()
    expect(screen.getByText('ifu_device.pdf')).toBeInTheDocument()
  })

  it('renders a View Results button for each extraction', async () => {
    vi.mocked(api.getAllExtractions).mockResolvedValue(mockExtractions)
    renderHistoryPage()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button', { name: /view results/i })
      expect(buttons).toHaveLength(2)
    })
  })

  it('shows error message when API call fails', async () => {
    vi.mocked(api.getAllExtractions).mockRejectedValue(new Error('Failed to load extraction history.'))
    renderHistoryPage()

    await waitFor(() => {
      expect(screen.getByText('Failed to load extraction history.')).toBeInTheDocument()
    })
  })
})
