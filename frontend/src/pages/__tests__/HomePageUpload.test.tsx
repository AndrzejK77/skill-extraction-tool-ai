import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import * as api from '../../services/extractionApi'
import HomePage from '../HomePage'

// Mock the API module
vi.mock('../../services/extractionApi', () => ({
  uploadExtraction: vi.fn(),
}))

// Mock useNavigate so we can assert the redirect destination
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

function makeFile(name: string, type: string) {
  return new File(['content'], name, { type })
}

describe('HomePage — upload flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls uploadExtraction with the selected CV and IFU files', async () => {
    vi.mocked(api.uploadExtraction).mockResolvedValue('new-extraction-id')
    const user = userEvent.setup()
    renderHomePage()

    const [cvInput, ifuInput] = document.querySelectorAll('input[type="file"]')
    await user.upload(cvInput as HTMLElement, makeFile('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
    await user.upload(ifuInput as HTMLElement, makeFile('ifu.pdf', 'application/pdf'))

    await user.click(screen.getByRole('button', { name: /extract skills/i }))

    await waitFor(() => {
      expect(api.uploadExtraction).toHaveBeenCalledOnce()
    })

    const [calledCv, calledIfu] = vi.mocked(api.uploadExtraction).mock.calls[0]
    expect(calledCv.name).toBe('cv.docx')
    expect(calledIfu.name).toBe('ifu.pdf')
  })

  it('navigates to /results/{id} on successful upload', async () => {
    vi.mocked(api.uploadExtraction).mockResolvedValue('abc-123')
    const user = userEvent.setup()
    renderHomePage()

    const [cvInput, ifuInput] = document.querySelectorAll('input[type="file"]')
    await user.upload(cvInput as HTMLElement, makeFile('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
    await user.upload(ifuInput as HTMLElement, makeFile('ifu.pdf', 'application/pdf'))

    await user.click(screen.getByRole('button', { name: /extract skills/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/results/abc-123')
    })
  })

  it('shows a validation error when no files are selected', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await user.click(screen.getByRole('button', { name: /extract skills/i }))

    expect(screen.getByText(/please select both a cv and an ifu document/i)).toBeInTheDocument()
    expect(api.uploadExtraction).not.toHaveBeenCalled()
  })

  it('shows the API error message when upload fails', async () => {
    vi.mocked(api.uploadExtraction).mockRejectedValue(new Error('Upload failed (HTTP 500). Please try again.'))
    const user = userEvent.setup()
    renderHomePage()

    const [cvInput, ifuInput] = document.querySelectorAll('input[type="file"]')
    await user.upload(cvInput as HTMLElement, makeFile('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
    await user.upload(ifuInput as HTMLElement, makeFile('ifu.pdf', 'application/pdf'))

    await user.click(screen.getByRole('button', { name: /extract skills/i }))

    await waitFor(() => {
      expect(screen.getByText(/upload failed \(http 500\)/i)).toBeInTheDocument()
    })
  })

  it('shows "Extracting…" while the upload is in progress', async () => {
    let resolve!: (id: string) => void
    vi.mocked(api.uploadExtraction).mockReturnValue(new Promise<string>((r) => { resolve = r }))
    const user = userEvent.setup()
    renderHomePage()

    const [cvInput, ifuInput] = document.querySelectorAll('input[type="file"]')
    await user.upload(cvInput as HTMLElement, makeFile('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
    await user.upload(ifuInput as HTMLElement, makeFile('ifu.pdf', 'application/pdf'))

    await user.click(screen.getByRole('button', { name: /extract skills/i }))

    expect(screen.getByText(/extracting…/i)).toBeInTheDocument()

    // Clean up — resolve the promise so the component finishes
    resolve('done-id')
  })
})
