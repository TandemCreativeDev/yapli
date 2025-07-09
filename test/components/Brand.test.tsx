import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Brand from '@/components/Brand';

// Mock the Logo component since we're testing Brand in isolation
jest.mock('../../src/components/Logo', () => {
  return function MockLogo({ size, className }: { size: number; className: string }) {
    return <div data-testid="mock-logo" data-size={size} className={className} />;
  };
});

describe('Brand', () => {
  it('renders the brand name correctly', () => {
    render(<Brand />);

    // Check if the brand name is rendered
    expect(screen.getByText('yapli')).toBeInTheDocument();
  });

  it('renders the Logo component with correct props', () => {
    render(<Brand />);

    // Check if the Logo component is rendered with correct props
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-size', '32');
    expect(logo).toHaveAttribute('class', 'mt-2');
  });

  it('applies correct styling to the brand name', () => {
    render(<Brand />);

    const brandName = screen.getByText('yapli');
    expect(brandName).toHaveClass('font-bold');
    expect(brandName).toHaveClass('font-mono');
    expect(brandName).toHaveClass('text-yapli-teal');
  });

  it('has a flex container with correct styling', () => {
    const { container } = render(<Brand />);

    // Get the main container div
    const brandContainer = container.firstChild;
    expect(brandContainer).toHaveClass('flex');
    expect(brandContainer).toHaveClass('items-center');
    expect(brandContainer).toHaveClass('gap-2');
  });
});
