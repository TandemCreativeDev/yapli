import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '@/components/ThemeToggle';

// Mock the next-themes library
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock the heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  SunIcon: () => <div data-testid="sun-icon" />,
  MoonIcon: () => <div data-testid="moon-icon" />,
}));

import { useTheme } from 'next-themes';

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });
  });

  it('renders nothing when not mounted', () => {
    // Override useEffect to not set mounted to true
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {});

    const { container } = render(<ThemeToggle />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the moon icon when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  it('renders the sun icon when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
    });

    render(<ThemeToggle />);

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  it('toggles from light to dark when clicked', () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme,
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light when clicked', () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme,
      resolvedTheme: 'dark',
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('handles system theme correctly', () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      setTheme,
      resolvedTheme: 'dark', // System is currently showing dark
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    // Should switch to light since system is showing dark
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('has the correct tooltip text for light mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('has the correct tooltip text for dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });
});
