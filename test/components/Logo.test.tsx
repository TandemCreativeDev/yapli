import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from '@/components/Logo';

describe('Logo', () => {
  it('renders with default props', () => {
    const { container } = render(<Logo />);

    // Check if the SVG is rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Check default size
    expect(svg).toHaveAttribute('width', '48');

    // Check if the logo body and eyes are present
    expect(container.querySelector('.logo-body')).toBeInTheDocument();
    expect(container.querySelector('.logo-eyes')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<Logo size={100} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');

    // Height should be proportional to width (595/500 ratio)
    expect(svg).toHaveAttribute('height', '119');
  });

  it('applies custom body color', () => {
    const { container } = render(<Logo bodyColour="#FF0000" />);

    const style = container.querySelector('style');
    expect(style?.textContent).toContain('fill: #FF0000');
  });

  it('applies custom eye color', () => {
    const { container } = render(<Logo eyeColour="#00FF00" />);

    const style = container.querySelector('style');
    expect(style?.textContent).toContain('fill: #00FF00');
  });

  it('applies hover colors', () => {
    const { container } = render(
      <Logo hoverBodyColour="#0000FF" hoverEyeColour="#FFFF00" />
    );

    const style = container.querySelector('style');
    expect(style?.textContent).toContain('fill: #0000FF');
    expect(style?.textContent).toContain('fill: #FFFF00');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<Logo animate={true} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('transition-all');
    expect(svg).toHaveClass('duration-300');
    expect(svg).toHaveClass('ease-in-out');
    expect(svg).toHaveClass('hover:scale-105');
  });

  it('does not apply animation class when animate is false', () => {
    const { container } = render(<Logo animate={false} />);

    const svg = container.querySelector('svg');
    expect(svg).not.toHaveClass('transition-all');
    expect(svg).not.toHaveClass('duration-300');
    expect(svg).not.toHaveClass('ease-in-out');
    expect(svg).not.toHaveClass('hover:scale-105');
  });

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<Logo />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
