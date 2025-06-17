/**
 * Utility functions for managing user aliases in localStorage per chatroom
 */

const ALIAS_KEY_PREFIX = 'yapli_alias_';

/**
 * Generate localStorage key for a specific room
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
    return typeof window !== 'undefined' && 'localStorage' in window;
  } catch {
    return false;
  }
}