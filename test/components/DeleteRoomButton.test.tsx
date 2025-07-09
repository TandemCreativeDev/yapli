import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteRoomButton from '@/components/DeleteRoomButton';

// Mock the heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  TrashIcon: () => <div data-testid="trash-icon" />,
}));

describe('DeleteRoomButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
    roomTitle: 'Test Room',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<DeleteRoomButton {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<DeleteRoomButton {...defaultProps} />);

    fireEvent.click(screen.getByRole('button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label with room title', () => {
    render(<DeleteRoomButton {...defaultProps} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete Test Room chatroom');
  });

  it('has correct title attribute', () => {
    render(<DeleteRoomButton {...defaultProps} />);

    expect(screen.getByRole('button')).toHaveAttribute('title', 'Delete room');
  });

  it('has correct styling classes', () => {
    render(<DeleteRoomButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('hover:bg-red-400');
    expect(button).toHaveClass('transition-colors');
  });
});
