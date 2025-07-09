import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoomCreationForm from '@/components/RoomCreationForm';

describe('RoomCreationForm', () => {
  const defaultProps = {
    onSubmit: jest.fn().mockResolvedValue(undefined),
    onCancel: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<RoomCreationForm {...defaultProps} />);

    expect(screen.getByText('Create New Room')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a title for your room...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Room' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('disables submit button when room title is empty', () => {
    render(<RoomCreationForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Create Room' })).toBeDisabled();
  });

  it('enables submit button when room title is not empty', () => {
    render(<RoomCreationForm {...defaultProps} />);

    const input = screen.getByLabelText('Room Title');
    fireEvent.change(input, { target: { value: 'Test Room' } });

    expect(screen.getByRole('button', { name: 'Create Room' })).not.toBeDisabled();
  });

  it('calls onSubmit with trimmed room title when form is submitted', async () => {
    render(<RoomCreationForm {...defaultProps} />);

    const input = screen.getByLabelText('Room Title');
    fireEvent.change(input, { target: { value: '  Test Room  ' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith('Test Room');

    // Wait for the async onSubmit to complete
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('does not call onSubmit when form is submitted with empty room title', () => {
    render(<RoomCreationForm {...defaultProps} />);

    const input = screen.getByLabelText('Room Title');
    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<RoomCreationForm {...defaultProps} />);

    const input = screen.getByLabelText('Room Title');
    fireEvent.change(input, { target: { value: 'Test Room' } });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('disables input and shows loading state when isLoading is true', () => {
    render(<RoomCreationForm {...defaultProps} isLoading={true} />);

    expect(screen.getByLabelText('Room Title')).toBeDisabled();
    expect(screen.getByLabelText('Room Title')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled();
  });
});
