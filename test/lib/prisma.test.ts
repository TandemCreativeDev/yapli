/*
  * During this file you will find many instances of
  * // eslint-disable-next-line @typescript-eslint/no-require-imports
  * This is not good practice, but due to the nature of prisma imports its the
  * best way to stub the methods for testing.
 */

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = jest.fn().mockImplementation(() => ({
    // Mock any methods used in the prisma.ts file
    // In this case; we don't need to mock any specific methods
  }));
  return { PrismaClient: mockPrismaClient };
});

describe('prisma client', () => {
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    jest.resetModules();
  });

  afterEach(() => {
    // @ts-expect-error deliberately overwriting
    process.env.NODE_ENV = originalNodeEnv;
    // Clean up the global object
    // eslint-disable-next-line
    if ((globalThis as any).prisma) {
      // eslint-disable-next-line
      delete (globalThis as any).prisma;
    }
  });

  it('should create a new PrismaClient instance', () => {
    // Import modules inside the test to ensure they're affected by the environment setup
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("../../src/lib/prisma");

    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(PrismaClient).toHaveBeenCalledWith({
      log: [],
    });
    expect(prisma).toBeDefined();
  });

  it('should reuse the existing PrismaClient instance on subsequent imports', () => {
    // Import modules inside the test to ensure they're affected by the environment setup
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma: prisma1 } = require("../../src/lib/prisma");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma: prisma2 } = require("../../src/lib/prisma");

    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(prisma1).toBe(prisma2);
  });

  it('should store the PrismaClient instance in the global object in non-production environments', () => {
    // @ts-expect-error deliberately overwriting
    process.env.NODE_ENV = 'development';

    // Import modules inside the test to ensure they're affected by the environment setup
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("../../src/lib/prisma");
    // eslint-disable-next-line
    expect((globalThis as any).prisma).toBe(prisma);
  });

  it('should not store the PrismaClient instance in the global object in production', () => {
    // @ts-expect-error deliberately overwriting
    process.env.NODE_ENV = 'production';

    // Import modules inside the test to ensure they're affected by the environment setup
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../src/lib/prisma");
    // eslint-disable-next-line
    expect((globalThis as any).prisma).toBeUndefined();
  });
});
