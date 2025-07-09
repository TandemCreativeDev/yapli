import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrimaryButton from '@/components/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders correctly with default props', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies gradient variant classes by default', () => {
    render(<PrimaryButton>Gradient Button</PrimaryButton>);

    const button = screen.getByRole('button', { name: /gradient button/i });
    expect(button).toHaveClass('bg-gradient-to-r');
    expect(button).toHaveClass('from-yapli-teal');
    expect(button).toHaveClass('to-yapli-dark');
  });

  it('applies outline variant classes when specified', () => {
    render(<PrimaryButton variant="outline">Outline Button</PrimaryButton>);

    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('border-yapli-teal');
    expect(button).toHaveClass('text-yapli-teal');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Clickable</PrimaryButton>);

    const button = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    const handleClick = jest.fn();
    render(
      <PrimaryButton onClick={handleClick} disabled>
        Disabled Button
      </PrimaryButton>
    );

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className correctly', () => {
    render(
      <PrimaryButton className="custom-class">
        Custom Class Button
      </PrimaryButton>
    );

    const button = screen.getByRole('button', { name: /custom class button/i });
    expect(button).toHaveClass('custom-class');
  });

  it('renders with submit type when specified', () => {
    render(<PrimaryButton type="submit">Submit</PrimaryButton>);

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
