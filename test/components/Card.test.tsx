import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../src/components/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div data-testid="child-element">Child Content</div>
      </Card>
    );

    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Child Content');
  });

  it('applies default classes', () => {
    render(<Card>Card Content</Card>);

    // Find the card container
    const cardElement = screen.getByText('Card Content').closest('div');
    expect(cardElement).toHaveClass('bg-card');
    expect(cardElement).toHaveClass('border');
    expect(cardElement).toHaveClass('border-border');
    expect(cardElement).toHaveClass('rounded-2xl');
    expect(cardElement).toHaveClass('p-8');
    expect(cardElement).toHaveClass('shadow-lg');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    render(<Card className={customClass}>Card with Custom Class</Card>);

    const cardElement = screen.getByText('Card with Custom Class').closest('div');
    expect(cardElement).toHaveClass(customClass);

    // Should still have the default classes as well
    expect(cardElement).toHaveClass('bg-card');
    expect(cardElement).toHaveClass('border');
  });

  it('renders complex nested content', () => {
    render(
      <Card>
        <h2 data-testid="card-title">Card Title</h2>
        <p data-testid="card-description">Card Description</p>
        <button data-testid="card-button">Click Me</button>
      </Card>
    );

    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-description')).toBeInTheDocument();
    expect(screen.getByTestId('card-button')).toBeInTheDocument();
  });
});
