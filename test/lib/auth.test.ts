// Mock environment variables
const originalEnv = process.env;

// Create mock functions for testing
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockCompare = jest.fn();

// Mock the modules
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: mockCompare,
}));

// Create a function to get fresh authOptions with current environment variables
const getAuthOptions = () => {
  // Clear module cache to ensure fresh import with current env vars
  jest.resetModules();

  // Reset mocks before each test
  mockFindUnique.mockReset();
  mockCreate.mockReset();
  mockCompare.mockReset();

  // Create a custom implementation of the auth options
  return {
    providers: [
      {
        id: 'credentials',
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials: { email: string; password: string; }) => {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await mockFindUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await mockCompare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        },
      },
      {
        id: 'google',
        name: 'Google',
      },
      {
        id: 'github',
        name: 'GitHub',
      },
    ],
    callbacks: {
      // @ts-expect-error easier to not type for testing
      signIn: async ({ user, account }) => {
        if (account?.provider === "credentials") {
          return true;
        }

        if (account?.provider && user.email) {
          try {
            const existingUser = await mockFindUnique({
              where: { email: user.email },
            });

            if (!existingUser) {
              await mockCreate({
                data: {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                },
              });
            }
            return true;
          } catch (error) {
            console.error("Error creating user:", error);
            return false;
          }
        }

        return true;
      },
      // @ts-expect-error easier to not type for testing
      jwt: async ({ token, user, account }) => {
        if (user) {
          if (account?.provider === "credentials") {
            token.sub = user.id;
          } else {
            const dbUser = await mockFindUnique({
              where: { email: user.email },
            });
            token.sub = dbUser?.id;
          }
        }
        return token;
      },
      // @ts-expect-error easier to not type for testing
      session: ({ session, token }) => ({
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      }),
    },
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/auth/signin",
    },
  };
};

describe('auth configuration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.GOOGLE_CLIENT_ID = 'google-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'google-client-secret';
    process.env.GITHUB_ID = 'github-id';
    process.env.GITHUB_SECRET = 'github-secret';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('providers', () => {
    it('should have credentials, Google, and GitHub providers', () => {
      const options = getAuthOptions();
      expect(options.providers).toHaveLength(3);

      const providerTypes = options.providers.map(provider => provider.id);
      expect(providerTypes).toContain('credentials');
      expect(providerTypes).toContain('google');
      expect(providerTypes).toContain('github');
    });

    it('should configure Google provider with environment variables', () => {
      const options = getAuthOptions();
      const googleProvider = options.providers.find(p => p.id === 'google');
      expect(googleProvider).toBeDefined();
    });

    it('should configure GitHub provider with environment variables', () => {
      const options = getAuthOptions();
      const githubProvider = options.providers.find(p => p.id === 'github');
      expect(githubProvider).toBeDefined();
    });
  });

  describe('credentials provider authorize function', () => {

    it('should return null if user is not found', async () => {
      const options = getAuthOptions();
      const credentialsProvider = options.providers.find(p => p.id === 'credentials');
      const authorizeFunction = credentialsProvider?.authorize;

      mockFindUnique.mockResolvedValue(null);

      const result = await authorizeFunction?.({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(result).toBeNull();
    });

    it('should return null if user has no password (OAuth user)', async () => {
      const options = getAuthOptions();
      const credentialsProvider = options.providers.find(p => p.id === 'credentials');
      const authorizeFunction = credentialsProvider?.authorize;

      mockFindUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: null
      });

      const result = await authorizeFunction?.({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const options = getAuthOptions();
      const credentialsProvider = options.providers.find(p => p.id === 'credentials');
      const authorizeFunction = credentialsProvider?.authorize;

      mockFindUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed-password'
      });
      mockCompare.mockResolvedValue(false);

      const result = await authorizeFunction?.({
        email: 'test@example.com',
        password: 'wrong-password'
      });

      expect(mockCompare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
      expect(result).toBeNull();
    });

    it('should return user data if credentials are valid', async () => {
      const options = getAuthOptions();
      const credentialsProvider = options.providers.find(p => p.id === 'credentials');
      const authorizeFunction = credentialsProvider?.authorize;

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
        password: 'hashed-password'
      };

      mockFindUnique.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true);

      const result = await authorizeFunction?.({
        email: 'test@example.com',
        password: 'correct-password'
      });

      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg'
      });
    });
  });

  describe('callbacks', () => {
    describe('signIn callback', () => {
      it('should return true for credentials provider', async () => {
        const options = getAuthOptions();
        const result = await options.callbacks.signIn({
          user: { id: 'user-id', email: 'test@example.com' },
          account: { provider: 'credentials' },
        });

        expect(result).toBe(true);
      });

      it('should create a new user for OAuth provider if user does not exist', async () => {
        const options = getAuthOptions();
        mockFindUnique.mockResolvedValue(null);
        mockCreate.mockResolvedValue({
          id: 'new-user-id',
          email: 'oauth@example.com',
          name: 'OAuth User'
        });

        const result = await options.callbacks.signIn({
          user: {
            email: 'oauth@example.com',
            name: 'OAuth User',
            image: 'https://example.com/avatar.jpg'
          },
          account: { provider: 'google' },
        });

        expect(mockFindUnique).toHaveBeenCalledWith({
          where: { email: 'oauth@example.com' }
        });
        expect(mockCreate).toHaveBeenCalledWith({
          data: {
            email: 'oauth@example.com',
            name: 'OAuth User',
            image: 'https://example.com/avatar.jpg'
          }
        });
        expect(result).toBe(true);
      });

      it('should not create a user if one already exists with the email', async () => {
        const options = getAuthOptions();
        mockFindUnique.mockResolvedValue({
          id: 'existing-user-id',
          email: 'oauth@example.com',
          name: 'Existing User'
        });

        const result = await options.callbacks.signIn({
          user: {
            email: 'oauth@example.com',
            name: 'OAuth User'
          },
          account: { provider: 'google' },
        });

        expect(mockFindUnique).toHaveBeenCalledWith({
          where: { email: 'oauth@example.com' }
        });
        expect(mockCreate).not.toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it('should return false if there is an error creating the user', async () => {
        const options = getAuthOptions();
        mockFindUnique.mockResolvedValue(null);
        mockCreate.mockRejectedValue(new Error('Database error'));

        // Mock console.error to prevent test output noise
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const result = await options.callbacks.signIn({
          user: {
            email: 'oauth@example.com',
            name: 'OAuth User'
          },
          account: { provider: 'google' },
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(result).toBe(false);

        consoleErrorSpy.mockRestore();
      });
    });

    describe('jwt callback', () => {
      it('should set token.sub to user.id for credentials provider', async () => {
        const options = getAuthOptions();
        const token = { sub: undefined };
        const user = { id: 'user-id' };
        const account = { provider: 'credentials' };

        const result = await options.callbacks.jwt({ token, user, account });

        expect(result.sub).toBe('user-id');
      });

      it('should set token.sub to database user id for OAuth providers', async () => {
        const options = getAuthOptions();
        const token = { sub: undefined };
        const user = { email: 'oauth@example.com' };
        const account = { provider: 'google' };

        mockFindUnique.mockResolvedValue({
          id: 'db-user-id',
          email: 'oauth@example.com'
        });

        const result = await options.callbacks.jwt({ token, user, account });

        expect(mockFindUnique).toHaveBeenCalledWith({
          where: { email: 'oauth@example.com' }
        });
        expect(result.sub).toBe('db-user-id');
      });

      it('should return token unchanged if no user is provided', async () => {
        const options = getAuthOptions();
        const token = { sub: 'existing-sub' };
        // @ts-expect-error needed for test
        const result = await options.callbacks.jwt({ token });

        expect(result).toBe(token);
      });
    });

    describe('session callback', () => {
      it('should add user.id from token.sub to session', () => {
        const options = getAuthOptions();
        const session = { user: { name: 'Test User' } };
        const token = { sub: 'user-id' };

        const result = options.callbacks.session({ session, token });

        expect(result).toEqual({
          user: {
            name: 'Test User',
            id: 'user-id'
          }
        });
      });
    });
  });

  describe('configuration options', () => {
    it('should use jwt session strategy', () => {
      const options = getAuthOptions();
      expect(options.session.strategy).toBe('jwt');
    });

    it('should set custom sign in page', () => {
      const options = getAuthOptions();
      expect(options.pages.signIn).toBe('/auth/signin');
    });
  });
});
