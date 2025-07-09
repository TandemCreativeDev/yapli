import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogoMark from '@/components/LogoMark';

// Mock the Logo component since we're testing LogoMark in isolation
jest.mock('../../src/components/Logo', () => {
  return function MockLogo({ size, className, animate }: { size: number; className: string; animate: boolean }) {
    return <div data-testid="mock-logo" data-size={size} data-animate={animate} className={className} />;
  };
});

describe('LogoMark', () => {
  it('renders the Logo component with correct props', () => {
    const { getByTestId } = render(<LogoMark />);

    const logo = getByTestId('mock-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-size', '48');
    expect(logo).toHaveAttribute('data-animate', 'true');
    expect(logo).toHaveAttribute('class', 'rounded-lg');
  });

  it('has a fixed position container with correct styling', () => {
    const { container } = render(<LogoMark />);

    const logoMarkContainer = container.firstChild;
    expect(logoMarkContainer).toHaveClass('fixed');
    expect(logoMarkContainer).toHaveClass('bottom-4');
    expect(logoMarkContainer).toHaveClass('right-4');
    expect(logoMarkContainer).toHaveClass('z-10');
    expect(logoMarkContainer).toHaveClass('opacity-60');
    expect(logoMarkContainer).toHaveClass('hover:opacity-100');
    expect(logoMarkContainer).toHaveClass('transition-opacity');
  });
});
