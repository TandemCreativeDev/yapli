import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoomCodeButton from '@/components/RoomCodeButton';

describe('RoomCodeButton', () => {
  const defaultProps = {
    code: 'ABC123',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<RoomCodeButton {...defaultProps} />);

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy room code ABC123 to clipboard');
    expect(screen.getByText('Copy room code to clipboard')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    render(<RoomCodeButton {...defaultProps} />);

    fireEvent.click(screen.getByRole('button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with fullWidth class when fullWidth prop is true', () => {
    render(<RoomCodeButton {...defaultProps} fullWidth={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('text-center');
  });

  it('positions tooltip correctly when fullWidth is true', () => {
    render(<RoomCodeButton {...defaultProps} fullWidth={true} />);

    const tooltip = screen.getByText('Copy room code to clipboard');
    expect(tooltip).toHaveClass('left-4');
    expect(tooltip).not.toHaveClass('left-1/2');
    expect(tooltip).not.toHaveClass('transform');
    expect(tooltip).not.toHaveClass('-translate-x-1/2');
  });

  it('positions tooltip correctly when fullWidth is false', () => {
    render(<RoomCodeButton {...defaultProps} fullWidth={false} />);

    const tooltip = screen.getByText('Copy room code to clipboard');
    expect(tooltip).toHaveClass('left-1/2');
    expect(tooltip).toHaveClass('transform');
    expect(tooltip).toHaveClass('-translate-x-1/2');
    expect(tooltip).not.toHaveClass('left-4');
  });

  it('has correct base styling regardless of fullWidth', () => {
    render(<RoomCodeButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-2');
    expect(button).toHaveClass('py-1');
    expect(button).toHaveClass('bg-gray-300');
    expect(button).toHaveClass('text-gray-700');
    expect(button).toHaveClass('rounded');
    expect(button).toHaveClass('font-mono');
    expect(button).toHaveClass('hover:bg-gray-200');
    expect(button).toHaveClass('cursor-pointer');
    expect(button).toHaveClass('transition-colors');
  });
});
