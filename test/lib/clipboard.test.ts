import { copyToClipboard } from "@/lib/clipboard";

describe('clipboard utility', () => {
  // Save the original navigator object
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // Mock the navigator.clipboard API
    Object.defineProperty(global, 'navigator', {
      value: {
        clipboard: {
          writeText: jest.fn().mockImplementation(() => Promise.resolve()),
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore the original navigator object
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should call navigator.clipboard.writeText with the provided text', async () => {
      const text = 'Test text to copy';
      await copyToClipboard(text);

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should return true when clipboard write is successful', async () => {
      const result = await copyToClipboard('Test text');
      expect(result).toBe(true);
    });

    it('should return false when clipboard write fails', async () => {
      // Mock the clipboard API to throw an error
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockImplementation(() => Promise.reject(new Error('Clipboard error'))),
        },
        writable: true,
      });

      // Mock console.error to prevent test output pollution
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const result = await copyToClipboard('Test text');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();

      // Restore console.error
      console.error = originalConsoleError;
    });
  });
});
