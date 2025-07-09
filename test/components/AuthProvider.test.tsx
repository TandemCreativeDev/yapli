import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthProvider from '@/components/AuthProvider';
import { SessionProvider } from 'next-auth/react';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  SessionProvider: jest.fn(({ children }) => <div data-testid="session-provider">{children}</div>),
}));

describe('AuthProvider', () => {
  it('renders SessionProvider with children', () => {
    const childText = 'Test Child';
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <div>{childText}</div>
      </AuthProvider>
    );

    expect(getByTestId('session-provider')).toBeInTheDocument();
    expect(getByText(childText)).toBeInTheDocument();
  });

  it('passes children to SessionProvider', () => {
    const { container } = render(
      <AuthProvider>
        <div data-testid="child-component">Child Component</div>
      </AuthProvider>
    );

    expect(SessionProvider).toHaveBeenCalled();
    expect(container.innerHTML).toContain('Child Component');
  });
});
