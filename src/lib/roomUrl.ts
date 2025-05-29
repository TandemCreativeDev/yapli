/**
 * Generates a short, URL-friendly room code
 * Uses alphanumeric characters (excluding similar looking ones like 0, O, l, I)
 * Length: 6 characters for good balance of brevity and collision resistance
 */
export function generateRoomUrl(): string {
  // Character set excluding confusing characters (0, O, l, I, 1)
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Validates if a string is a valid room URL format
 */
export function isValidRoomUrl(roomUrl: string): boolean {
  return /^[a-z2-9]{6}$/.test(roomUrl);
}