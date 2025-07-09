import { generateRoomUrl, isValidRoomUrl } from "@/lib/roomUrl";

describe('roomUrl utility', () => {
  describe('generateRoomUrl', () => {
    it('should generate a string of length 6', () => {
      const roomUrl = generateRoomUrl();
      expect(roomUrl.length).toBe(6);
    });

    it('should only use allowed characters', () => {
      const roomUrl = generateRoomUrl();
      // The regex matches only characters that are in the allowed set
      // (excluding confusing characters like 0, O, l, I, 1)
      expect(roomUrl).toMatch(/^[abcdefghijkmnpqrstuvwxyz23456789]+$/);
    });

    it('should generate different values on subsequent calls', () => {
      const roomUrl1 = generateRoomUrl();
      const roomUrl2 = generateRoomUrl();
      expect(roomUrl1).not.toBe(roomUrl2);
    });
  });

  describe('isValidRoomUrl', () => {
    it('should return true for valid room URLs', () => {
      expect(isValidRoomUrl('abc234')).toBe(true);
      expect(isValidRoomUrl('zyx987')).toBe(true);
      expect(isValidRoomUrl('mnpqrs')).toBe(true);
    });

    it('should return false for invalid room URLs', () => {
      // Too short
      expect(isValidRoomUrl('abc23')).toBe(false);
      // Too long
      expect(isValidRoomUrl('abc2345')).toBe(false);
      // Contains invalid characters
      expect(isValidRoomUrl('abc01I')).toBe(false);
      expect(isValidRoomUrl('ABC234')).toBe(false);
      // Empty string
      expect(isValidRoomUrl('')).toBe(false);
    });
  });
});
