import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageInput from '@/components/MessageInput';

describe('MessageInput', () => {
  const defaultProps = {
    onSendMessageAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<MessageInput {...defaultProps} />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('enables the send button when text is entered', () => {
    render(<MessageInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(screen.getByRole('button', { name: 'Send' })).not.toBeDisabled();
  });

  it('calls onSendMessageAction when form is submitted', () => {
    render(<MessageInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(defaultProps.onSendMessageAction).toHaveBeenCalledWith('Hello world');
    expect(input).toHaveValue('');
  });

  it('does not call onSendMessageAction when form is submitted with empty message', () => {
    render(<MessageInput {...defaultProps} />);

    const form = screen.getByPlaceholderText('Type your message...').closest('form');
    fireEvent.submit(form!);

    expect(defaultProps.onSendMessageAction).not.toHaveBeenCalled();
  });

  it('does not call onSendMessageAction when form is submitted with only whitespace', () => {
    render(<MessageInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: '   ' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(defaultProps.onSendMessageAction).not.toHaveBeenCalled();
  });

  it('trims whitespace from message before sending', () => {
    render(<MessageInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: '  Hello world  ' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(defaultProps.onSendMessageAction).toHaveBeenCalledWith('Hello world');
  });

  it('disables input when disabled prop is true', () => {
    render(<MessageInput {...defaultProps} disabled={true} />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('refocuses input after sending when disabled becomes false', () => {
    const { rerender } = render(<MessageInput {...defaultProps} disabled={true} />);

    const input = screen.getByPlaceholderText('Type your message...');

    // Mock focus method
    const mockFocus = jest.fn();
    input.focus = mockFocus;

    // First, enable the input and add text
    rerender(<MessageInput {...defaultProps} disabled={false} />);
    fireEvent.change(input, { target: { value: 'Hello world' } });

    // Submit the form
    const form = input.closest('form');
    fireEvent.submit(form!);

    // Disable the input
    rerender(<MessageInput {...defaultProps} disabled={true} />);

    // Then enable it again
    rerender(<MessageInput {...defaultProps} disabled={false} />);

    // Check if focus was called
    expect(mockFocus).toHaveBeenCalled();
  });
});
