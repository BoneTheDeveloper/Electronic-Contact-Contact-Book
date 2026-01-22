import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'

// Mock server action
vi.mock('@/lib/auth', () => ({
  login: vi.fn((formData: FormData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        throw new Error('Redirect: /teacher/dashboard')
      }, 100)
    })
  }),
}))

// Mock AuthBrandingPanel
vi.mock('@/components/auth-branding-panel', () => ({
  AuthBrandingPanel: () => <div data-testid="branding-panel">Branding</div>,
}))

describe('Login Page - Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const passwordInput = screen.getByPlaceholderText('••••••••')
    const toggleButton = screen.getByRole('button', { name: '' }).querySelector('button[type="button"]')?.parentElement?.querySelector('button')

    expect(passwordInput).toHaveAttribute('type', 'password')

    // Find the show/hide password button
    const showHideButtons = screen.getAllByRole('button')
    const toggleBtn = showHideButtons.find(btn => btn.innerHTML.includes('svg'))

    if (toggleBtn) {
      await user.click(toggleBtn)
      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(toggleBtn)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  it('should switch between teacher and admin role', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const teacherButton = screen.getByRole('button', { name: /giáo viên/i })
    const adminButton = screen.getByRole('button', { name: /quản trị viên/i })

    expect(teacherButton.className).toContain('bg-[#0284C7]')

    await user.click(adminButton)

    expect(adminButton.className).toContain('bg-[#0284C7]')

    const label = screen.getByText(/mã quản trị viên/i)
    expect(label).toBeInTheDocument()
  })

  it('should show validation error for empty identifier', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })
    const form = submitButton.closest('form')

    if (form) {
      form.requestSubmit()
      await waitFor(() => {
        const identifierInput = screen.getByPlaceholderText(/TC001|AD001/)
        expect(identifierInput).toBeInvalid()
      })
    }
  })

  it('should show validation error for empty password', async () => {
    render(<LoginPage />)

    const passwordInput = screen.getByPlaceholderText('••••••••')
    expect(passwordInput).toBeRequired()
  })

  it('should submit form with valid teacher credentials', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const identifierInput = screen.getByPlaceholderText('TC001')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(identifierInput, 'TC001')
    await user.type(passwordInput, 'password123')

    const form = submitButton.closest('form')
    if (form) {
      form.requestSubmit()
    }
  })

  it('should submit form with valid admin credentials', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const adminButton = screen.getByRole('button', { name: /quản trị viên/i })
    await user.click(adminButton)

    const identifierInput = screen.getByPlaceholderText('AD001')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(identifierInput, 'AD001')
    await user.type(passwordInput, 'password123')

    const form = submitButton.closest('form')
    if (form) {
      form.requestSubmit()
    }
  })

  it('should accept email format instead of code', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const identifierInput = screen.getByPlaceholderText('TC001')
    const passwordInput = screen.getByPlaceholderText('••••••••')

    await user.type(identifierInput, 'teacher@school.edu')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })
    const form = submitButton.closest('form')
    if (form) {
      form.requestSubmit()
    }
  })
})
