/**
 * Utility functions for managing user aliases in localStorage per chatroom
 */

const ALIAS_KEY_PREFIX = 'yapli_alias_';

/**
 * Generate a localStorage key for a specific room
 */
function getAliasKey(roomId: string): string {
  return `${ALIAS_KEY_PREFIX}${roomId}`;
}

/**
 * Save user alias for a specific chatroom
 */
export function saveAlias(roomId: string, alias: string): void {
  try {
    localStorage.setItem(getAliasKey(roomId), alias);
  } catch (error) {
    console.warn('Failed to save alias to localStorage:', error);
  }
}

/**
 * Get saved alias for a specific chatroom
 */
export function getAlias(roomId: string): string | null {
  try {
    return localStorage.getItem(getAliasKey(roomId));
  } catch (error) {
    console.warn('Failed to get alias from localStorage:', error);
    return null;
  }
}

/**
 * Remove saved alias for a specific chatroom
 */
export function removeAlias(roomId: string): void {
  try {
    localStorage.removeItem(getAliasKey(roomId));
  } catch (error) {
    console.warn('Failed to remove alias from localStorage:', error);
  }
}

/**
 * Check if localStorage is available (for SSR compatibility)
 */
export function isLocalStorageAvailable(): boolean {
  try {
    // Check if a window exists (for SSR)
    if (typeof window === 'undefined') {
      return false;
    }

    // Check if localStorage exists as a property
    // This will catch both when localStorage is undefined and when accessing it throws an error
    const storage = window.localStorage;

    // Additional check to ensure localStorage is actually usable
    const testKey = '__test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}
