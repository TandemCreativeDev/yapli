import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CopyUrlButton from '@/components/CopyUrlButton';

// Mock the heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  LinkIcon: () => <div data-testid="link-icon" />,
}));

describe('CopyUrlButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
    roomTitle: 'Test Room',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<CopyUrlButton {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
    expect(screen.queryByText('Copy URL')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<CopyUrlButton {...defaultProps} />);

    fireEvent.click(screen.getByRole('button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with text when showText is true', () => {
    render(<CopyUrlButton {...defaultProps} showText={true} />);

    expect(screen.getByText('Copy URL')).toBeInTheDocument();
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<CopyUrlButton {...defaultProps} fullWidth={true} />);

    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('applies custom className when provided', () => {
    render(<CopyUrlButton {...defaultProps} className="custom-class" />);

    expect(screen.getByRole('button').parentElement).toHaveClass('custom-class');
  });

  it('has correct aria-label with room title', () => {
    render(<CopyUrlButton {...defaultProps} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy URL for Test Room chatroom');
  });

  it('renders tooltip text', () => {
    render(<CopyUrlButton {...defaultProps} />);

    expect(screen.getByText('Copy full URL to clipboard')).toBeInTheDocument();
  });

  it('applies correct classes for button with text', () => {
    render(<CopyUrlButton {...defaultProps} showText={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('text-base');
  });
});
