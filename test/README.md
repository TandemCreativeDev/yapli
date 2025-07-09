# Yapli Test Suite

This document outlines the testing principles, structure, and practices used in the Yapli project.

## Testing Principles

The Yapli test suite follows these core principles:

1. **Component Isolation**: Each component is tested in isolation to ensure it functions correctly regardless of its context.
2. **Behavior-Driven**: Tests focus on the behavior of components and functions rather than implementation details.
3. **Comprehensive Coverage**: We aim to test all critical paths and edge cases.
4. **Maintainability**: Tests are structured to be easy to understand and maintain.

## Test Structure

The test suite is organized into the following directories:

- `test/components/`: Tests for React components
- `test/lib/`: Tests for utility functions and libraries

## Testing Tools

Yapli uses the following testing tools:

- **Jest**: As the test runner and assertion library
- **React Testing Library**: For rendering and testing React components
- **jest-dom**: For additional DOM-specific assertions

## Test Patterns

### Component Tests

Component tests follow this pattern:

1. Render the component with specific props
2. Query the rendered output using screen queries
3. Make assertions about the component's behavior and appearance
4. Test interactions like clicks using fireEvent

Example:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '@/components/Component';

describe('Component', () => {
  it('renders correctly with default props', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Utility Function Tests

Utility function tests follow this pattern:

1. Call the utility function with specific inputs
2. Make assertions about the return values
3. Test edge cases and invalid inputs

Example:
```typescript
import { utilityFunction } from '@/lib/utilities';

describe('utilityFunction', () => {
  it('returns expected output for valid input', () => {
    expect(utilityFunction('valid input')).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(utilityFunction('')).toBe(null);
    expect(utilityFunction(null)).toThrow();
  });
});
```

## Running Tests

You can run the tests using the following npm scripts:

- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode, which will rerun tests when files change

## Test Configuration

The Jest configuration is defined in `jest.config.ts` and includes:

- Test environment setup with jsdom for DOM testing
- Module mappers for handling CSS and image imports
- Coverage collection settings
- Test file patterns

Additional setup is performed in `jest.setup.ts`, which includes:

- DOM testing extensions from @testing-library/jest-dom
- Mocks for browser APIs not available in jsdom (matchMedia, IntersectionObserver)

## Writing New Tests

When writing new tests:

1. Place component tests in `test/components/`
2. Place utility function tests in `test/lib/`
3. Follow the established patterns for each type of test
4. Ensure tests are isolated and don't depend on other tests
5. Focus on testing behavior, not implementation details
