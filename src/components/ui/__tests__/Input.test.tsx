import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Input from '../Input'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
    expect(input).not.toBeDisabled()
    expect(input).not.toBeRequired()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your name" />)
    
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Name" id="name" />)
    
    const label = screen.getByText('Name')
    const input = screen.getByLabelText('Name')
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('renders with required label', () => {
    render(<Input label="Email" required id="email" />)
    
    const label = screen.getByText('Email')
    const requiredMark = screen.getByText('*')
    expect(label).toBeInTheDocument()
    expect(requiredMark).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<Input value="test value" onChange={() => {}} />)
    
    const input = screen.getByDisplayValue('test value')
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'new value' })
      })
    )
  })

  it('calls onBlur when input loses focus', () => {
    const handleBlur = jest.fn()
    render(<Input onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('calls onFocus when input gains focus', () => {
    const handleFocus = jest.fn()
    render(<Input onFocus={handleFocus} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('renders required input', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('renders with error message', () => {
    render(<Input error="This field is required" />)
    
    const errorMessage = screen.getByText('This field is required')
    const input = screen.getByRole('textbox')
    
    expect(errorMessage).toBeInTheDocument()
    expect(input).toHaveClass('error')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')

    rerender(<Input type="tel" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel')
  })

  it('renders with name and id attributes', () => {
    render(<Input name="username" id="username" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'username')
    expect(input).toHaveAttribute('id', 'username')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('renders with label and input properly connected', () => {
    render(<Input label="Username" id="username" />)
    
    const input = screen.getByLabelText('Username')
    expect(input).toHaveAttribute('id', 'username')
  })
})
