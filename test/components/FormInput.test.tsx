import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormInput from '@/components/FormInput';

describe('FormInput', () => {
  const defaultProps = {
    type: 'text',
    id: 'test-input',
    label: 'Test Label',
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    render(<FormInput {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('id', 'test-input');
    expect(screen.getByLabelText('Test Label')).not.toBeRequired();
    expect(screen.getByLabelText('Test Label')).not.toBeDisabled();
  });

  it('renders with the provided value', () => {
    render(<FormInput {...defaultProps} value="Test Value" />);

    expect(screen.getByLabelText('Test Label')).toHaveValue('Test Value');
  });

  it('calls onChange when the input value changes', () => {
    const handleChange = jest.fn();
    render(<FormInput {...defaultProps} onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'New Value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies required attribute when required prop is true', () => {
    render(<FormInput {...defaultProps} required={true} />);

    expect(screen.getByLabelText('Test Label')).toBeRequired();
  });

  it('applies placeholder when provided', () => {
    render(<FormInput {...defaultProps} placeholder="Test Placeholder" />);

    expect(screen.getByLabelText('Test Label')).toHaveAttribute('placeholder', 'Test Placeholder');
  });

  it('applies maxLength when provided', () => {
    render(<FormInput {...defaultProps} maxLength={10} />);

    expect(screen.getByLabelText('Test Label')).toHaveAttribute('maxLength', '10');
  });

  it('disables the input when disabled prop is true', () => {
    render(<FormInput {...defaultProps} disabled={true} />);

    expect(screen.getByLabelText('Test Label')).toBeDisabled();
  });

  it('applies custom className when provided', () => {
    render(<FormInput {...defaultProps} className="custom-class" />);

    expect(screen.getByLabelText('Test Label')).toHaveClass('custom-class');
  });

  it('calls onKeyDown when a key is pressed', () => {
    const handleKeyDown = jest.fn();
    render(<FormInput {...defaultProps} onKeyDown={handleKeyDown} />);

    fireEvent.keyDown(screen.getByLabelText('Test Label'), { key: 'Enter', code: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('renders with different input types', () => {
    render(<FormInput {...defaultProps} type="password" />);

    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'password');
  });
});
