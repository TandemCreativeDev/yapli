import type { Config } from 'jest';
import nextJest from 'next/jest';

// Create a custom Next.js configuration to be passed to Jest
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Jest configuration object
const config: Config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Test environment for React components
  testEnvironment: 'jest-environment-jsdom',

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which files should be considered for coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
  ],

  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],

  // An array of regexp pattern strings that are matched against all source file paths
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // A map from regular expressions to module names or to arrays of module names
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
export default createJestConfig(config);
