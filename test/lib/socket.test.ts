import { renderHook, act } from '@testing-library/react';
import { useSocket } from '@/lib/socket';
import { io } from 'socket.io-client';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
  return {
    io: jest.fn(() => mockSocket),
  };
});

describe('useSocket hook', () => {
  const mockRoomId = 'room-123';
  const mockOnNewMessage = jest.fn();
  const mockOnUsersUpdated = jest.fn();
  const mockOnAliasRejected = jest.fn();
  // any isn't allowed, but mocks are hard
  // eslint-disable-next-line
  let mockSocket: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = (io as jest.Mock)();
    // Reset the mock implementation for on to avoid affecting other tests
    mockSocket.on.mockImplementation(() => {});
  });

  it('should initialize socket connection and join room', () => {
    renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Check if socket.io client was initialized
    expect(io).toHaveBeenCalled();

    // Check event listeners were set up
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('new-message', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('users-updated', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('alias-rejected', expect.any(Function));
  });

  it('should emit join-room event when connected', () => {
    renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Get the connect callback
    const connectCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'connect'
    )[1];

    // Call the connect callback
    connectCallback();

    // Check if join-room was emitted with correct roomId
    expect(mockSocket.emit).toHaveBeenCalledWith('join-room', mockRoomId);
  });

  it('should call onNewMessage when new-message event is received for the correct room', () => {
    renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Get the new-message callback
    const newMessageCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'new-message'
    )[1];

    const mockMessage = {
      id: 'msg-1',
      chatroomId: mockRoomId,
      alias: 'User1',
      message: 'Hello world',
      timestamp: '2023-01-01T12:00:00Z',
    };

    // Call the new-message callback
    newMessageCallback(mockMessage);

    // Check if onNewMessage was called with the message
    expect(mockOnNewMessage).toHaveBeenCalledWith(mockMessage);
  });

  it('should not call onNewMessage when new-message event is for a different room', () => {
    renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Get the new-message callback
    const newMessageCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'new-message'
    )[1];

    const mockMessage = {
      id: 'msg-1',
      chatroomId: 'different-room',
      alias: 'User1',
      message: 'Hello world',
      timestamp: '2023-01-01T12:00:00Z',
    };

    // Call the new-message callback
    newMessageCallback(mockMessage);

    // Check that onNewMessage was not called
    expect(mockOnNewMessage).not.toHaveBeenCalled();
  });

  it('should call onUsersUpdated when users-updated event is received', () => {
    renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Get the users-updated callback
    const usersUpdatedCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'users-updated'
    )[1];

    const mockUsers = ['User1', 'User2', 'User3'];

    // Call the users-updated callback
    usersUpdatedCallback(mockUsers);

    // Check if onUsersUpdated was called with the users array
    expect(mockOnUsersUpdated).toHaveBeenCalledWith(mockUsers);
  });

  it('should call onAliasRejected when alias-rejected event is received', () => {
    renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Get the alias-rejected callback
    const aliasRejectedCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'alias-rejected'
    )[1];

    const mockReason = 'Alias already taken';

    // Call the alias-rejected callback
    aliasRejectedCallback({ reason: mockReason });

    // Check if onAliasRejected was called with the reason
    expect(mockOnAliasRejected).toHaveBeenCalledWith(mockReason);
  });

  it('should disconnect socket when component unmounts', () => {
    const { unmount } = renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Unmount the component
    unmount();

    // Check if disconnect was called
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should emit set-alias event when setAlias is called', () => {
    // Mock isConnected state
    mockSocket.on.mockImplementation((event: string, callback: () => void) => {
      if (event === 'connect') {
        callback(); // This will set isConnected to true
      }
    });

    const { result } = renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Call setAlias
    act(() => {
      result.current.setAlias('TestUser');
    });

    // Check if set-alias was emitted with correct alias
    expect(mockSocket.emit).toHaveBeenCalledWith('set-alias', 'TestUser');
  });

  it('should not emit set-alias event when not connected', () => {
    const { result } = renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Reset mock to clear any previous calls
    mockSocket.emit.mockClear();

    // Call setAlias (without triggering connect callback)
    act(() => {
      result.current.setAlias('TestUser');
    });

    // Check that set-alias was not emitted
    expect(mockSocket.emit).not.toHaveBeenCalledWith('set-alias', 'TestUser');
  });

  it('should emit send-message event when emitMessage is called', () => {
    const { result } = renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Call emitMessage
    act(() => {
      result.current.emitMessage('TestUser', 'Hello world');
    });

    // Check if a send message was emitted with correct data
    expect(mockSocket.emit).toHaveBeenCalledWith('send-message', {
      roomId: mockRoomId,
      alias: 'TestUser',
      message: 'Hello world',
    });
  });

  it('should update isConnected state on connect and disconnect events', () => {
    const { result } = renderHook(() =>
      useSocket({
        roomId: mockRoomId,
        onNewMessage: mockOnNewMessage,
        onUsersUpdated: mockOnUsersUpdated,
        onAliasRejected: mockOnAliasRejected,
      })
    );

    // Initially isConnected should be false
    expect(result.current.isConnected).toBe(false);

    // Get the connect callback
    const connectCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'connect'
    )[1];

    // Call the connect callback
    act(() => {
      connectCallback();
    });

    // Now isConnected should be true
    expect(result.current.isConnected).toBe(true);

    // Get the disconnect callback
    const disconnectCallback = mockSocket.on.mock.calls.find(
        (call: string[]) => call[0] === 'disconnect'
    )[1];

    // Call the disconnect callback
    act(() => {
      disconnectCallback();
    });

    // Now isConnected should be false again
    expect(result.current.isConnected).toBe(false);
  });
});
