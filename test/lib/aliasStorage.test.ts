import { saveAlias, getAlias, removeAlias, isLocalStorageAvailable } from '@/lib/aliasStorage';

describe('aliasStorage utility', () => {
  const mockRoomId = 'room123';
  const mockAlias = 'TestUser';
  const mockStorageKey = 'yapli_alias_room123';

  // Mock localStorage
  let localStorageMock: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };

  beforeEach(() => {
    // Setup localStorage mock
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  describe('saveAlias', () => {
    it('should save alias to localStorage with correct key', () => {
      saveAlias(mockRoomId, mockAlias);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(mockStorageKey, mockAlias);
    });

    it('should handle errors gracefully', () => {
      // Mock console.warn to prevent test output noise
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Make localStorage.setItem throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Function should not throw
      expect(() => saveAlias(mockRoomId, mockAlias)).not.toThrow();

      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getAlias', () => {
    it('should retrieve alias from localStorage with correct key', () => {
      localStorageMock.getItem.mockReturnValue(mockAlias);

      const result = getAlias(mockRoomId);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(mockStorageKey);
      expect(result).toBe(mockAlias);
    });

    it('should return null if alias is not found', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getAlias(mockRoomId);

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', () => {
      // Mock console.warn to prevent test output noise
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Make localStorage.getItem throw an error
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Function should not throw and return null
      expect(getAlias(mockRoomId)).toBeNull();

      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('removeAlias', () => {
    it('should remove alias from localStorage with correct key', () => {
      removeAlias(mockRoomId);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(mockStorageKey);
    });

    it('should handle errors gracefully', () => {
      // Mock console.warn to prevent test output noise
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Make localStorage.removeItem throw an error
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Function should not throw
      expect(() => removeAlias(mockRoomId)).not.toThrow();

      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage is not available', () => {
      // Simulate environment without localStorage
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true
      });

      expect(isLocalStorageAvailable()).toBe(false);
    });

    it('should return false when accessing localStorage throws an error', () => {
      // Make accessing localStorage throw an error (as in some privacy modes)
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('SecurityError');
        }
      });

      expect(isLocalStorageAvailable()).toBe(false);
    });
  });
});
