import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import HomePage from '../HomePage'

// Mock the API module — we don't test network calls here
vi.mock('../../services/extractionApi', () => ({
  uploadExtraction: vi.fn(),
}))

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

describe('HomePage', () => {
  it('renders the CV file input', () => {
    renderHomePage()
    const inputs = screen.getAllByRole('button', { hidden: true })
    // Two file inputs should be present in the DOM
    const fileInputs = document.querySelectorAll('input[type="file"]')
    expect(fileInputs).toHaveLength(2)
  })

  it('renders CV and IFU labels', () => {
    renderHomePage()
    expect(screen.getByText('CV Document')).toBeInTheDocument()
    expect(screen.getByText('IFU Document')).toBeInTheDocument()
  })

  it('renders the Extract Skills submit button', () => {
    renderHomePage()
    expect(screen.getByRole('button', { name: /extract skills/i })).toBeInTheDocument()
  })

  it('submit button is enabled by default', () => {
    renderHomePage()
    expect(screen.getByRole('button', { name: /extract skills/i })).not.toBeDisabled()
  })
})
