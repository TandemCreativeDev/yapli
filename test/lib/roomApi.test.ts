import { fetchChatrooms, createRoom, deleteRoom } from '@/lib/roomApi';

// Mock global fetch
global.fetch = jest.fn();

describe('roomApi', () => {
  const mockChatrooms = [
    {
      id: 'room1',
      roomUrl: 'abc123',
      title: 'Test Room 1',
      createdAt: '2023-01-01T00:00:00Z',
      _count: {
        messages: 10,
      },
    },
    {
      id: 'room2',
      roomUrl: 'def456',
      title: 'Test Room 2',
      createdAt: '2023-01-02T00:00:00Z',
      _count: {
        messages: 5,
      },
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchChatrooms', () => {
    it('should fetch chatrooms successfully', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockChatrooms),
      });

      const result = await fetchChatrooms();

      expect(global.fetch).toHaveBeenCalledWith('/api/rooms');
      expect(result).toEqual(mockChatrooms);
    });

    it('should throw an error when fetch fails', async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchChatrooms()).rejects.toThrow('Failed to fetch chatrooms');
      expect(global.fetch).toHaveBeenCalledWith('/api/rooms');
    });
  });

  describe('createRoom', () => {
    it('should create a room successfully', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const title = 'New Test Room';
      await createRoom(title);

      expect(global.fetch).toHaveBeenCalledWith('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
    });

    it('should trim the room title before sending', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const title = '  New Test Room  ';
      await createRoom(title);

      expect(global.fetch).toHaveBeenCalledWith('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Test Room' }),
      });
    });

    it('should throw an error when creation fails', async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(createRoom('Test Room')).rejects.toThrow('Failed to create room');
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room using roomUrl when available', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const room = mockChatrooms[0]; // Has roomUrl
      await deleteRoom(room);

      expect(global.fetch).toHaveBeenCalledWith(`/api/rooms/${room.roomUrl}`, {
        method: 'DELETE',
      });
    });

    it('should delete a room using id when roomUrl is not available', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const room = {
        ...mockChatrooms[0],
        roomUrl: undefined,
      };

      await deleteRoom(room);

      expect(global.fetch).toHaveBeenCalledWith(`/api/rooms/${room.id}`, {
        method: 'DELETE',
      });
    });

    it('should throw an error when deletion fails', async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(deleteRoom(mockChatrooms[0])).rejects.toThrow('Failed to delete chatroom');
    });
  });
});
