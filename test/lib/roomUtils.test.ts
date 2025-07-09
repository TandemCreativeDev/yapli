import { copyRoomUrl, copyRoomId } from '@/lib/roomUtils';
import * as clipboard from '@/lib/clipboard';

// Mock the clipboard module
jest.mock('../../src/lib/clipboard', () => ({
  copyToClipboard: jest.fn(),
}));

describe('roomUtils', () => {
  const mockRoom = {
    id: 'room123',
    roomUrl: 'abc123',
    title: 'Test Room',
    createdAt: '2023-01-01T00:00:00Z',
    _count: {
      messages: 10,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('copyRoomUrl', () => {
    it('should copy the full URL with roomUrl to clipboard', async () => {
      // Mock successful clipboard copy
      (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(true);

      const result = await copyRoomUrl(mockRoom);

      expect(clipboard.copyToClipboard).toHaveBeenCalledWith('https://yapli.chat/abc123');
      expect(result).toBe(true);
    });

    it('should use room.id if roomUrl is not available', async () => {
      // Create a room without roomUrl
      const roomWithoutUrl = {
        ...mockRoom,
        roomUrl: undefined,
      };

      // Mock successful clipboard copy
      (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(true);

      const result = await copyRoomUrl(roomWithoutUrl);

      expect(clipboard.copyToClipboard).toHaveBeenCalledWith('https://yapli.chat/room123');
      expect(result).toBe(true);
    });

    it('should return false if clipboard copy fails', async () => {
      // Mock failed clipboard copy
      (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(false);

      const result = await copyRoomUrl(mockRoom);

      expect(clipboard.copyToClipboard).toHaveBeenCalledWith('https://yapli.chat/abc123');
      expect(result).toBe(false);
    });
  });

  describe('copyRoomId', () => {
    it('should copy the roomUrl to clipboard', async () => {
      // Mock successful clipboard copy
      (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(true);

      const result = await copyRoomId(mockRoom);

      expect(clipboard.copyToClipboard).toHaveBeenCalledWith('abc123');
      expect(result).toBe(true);
    });

    it('should use room.id if roomUrl is not available', async () => {
      // Create a room without roomUrl
      const roomWithoutUrl = {
        ...mockRoom,
        roomUrl: undefined,
      };

      // Mock successful clipboard copy
      (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(true);

      const result = await copyRoomId(roomWithoutUrl);

      expect(clipboard.copyToClipboard).toHaveBeenCalledWith('room123');
      expect(result).toBe(true);
    });

    it('should return false if clipboard copy fails', async () => {
      // Mock failed clipboard copy
      (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(false);

      const result = await copyRoomId(mockRoom);

      expect(clipboard.copyToClipboard).toHaveBeenCalledWith('abc123');
      expect(result).toBe(false);
    });
  });
});
