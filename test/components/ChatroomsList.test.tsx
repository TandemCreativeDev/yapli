import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatroomsList from '@/components/ChatroomsList';

// Mock the child components
jest.mock('../../src/components/RoomCodeButton', () => ({
  __esModule: true,
  // @ts-expect-error for testing
  default: ({ onClick, code }) => (
    <button data-testid="room-code-button" onClick={onClick}>
      {code}
    </button>
  ),
}));

jest.mock('../../src/components/CopyUrlButton', () => ({
  __esModule: true,
  // @ts-expect-error for testing
  default: ({ onClick, roomTitle }) => (
    <button data-testid="copy-url-button" onClick={onClick}>
      Copy URL for {roomTitle}
    </button>
  ),
}));

jest.mock('../../src/components/DeleteRoomButton', () => ({
  __esModule: true,
  // @ts-expect-error for testing
  default: ({ onClick, roomTitle }) => (
    <button data-testid="delete-room-button" onClick={onClick}>
      Delete {roomTitle}
    </button>
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  // @ts-expect-error for testing
  default: ({ href, children, className }) => (
    <a href={href} className={className} data-testid="next-link">
      {children}
    </a>
  ),
}));

describe('ChatroomsList', () => {
  const mockChatrooms = [
    {
      id: 'room1',
      roomUrl: 'test-room-1',
      title: 'Test Room 1',
      createdAt: '2023-01-01T00:00:00.000Z',
      _count: {
        messages: 10,
      },
    },
    {
      id: 'room2',
      title: 'Test Room 2',
      createdAt: '2023-01-02T00:00:00.000Z',
      _count: {
        messages: 5,
      },
    },
  ];

  const defaultProps = {
    chatrooms: mockChatrooms,
    isLoading: false,
    handleCopyRoomUrl: jest.fn(),
    handleCopyRoomId: jest.fn(),
    handleDeleteRoom: jest.fn(),
  };

  it('renders loading state when isLoading is true', () => {
    render(<ChatroomsList {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading chatrooms...')).toBeInTheDocument();
  });

  it('renders empty state when no chatrooms are available', () => {
    render(<ChatroomsList {...defaultProps} chatrooms={[]} />);
    expect(screen.getByText("You haven't created any chatrooms yet.")).toBeInTheDocument();
  });

  it('renders a list of chatrooms when available', () => {
    render(<ChatroomsList {...defaultProps} />);
    expect(screen.getAllByText('Test Room 1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Test Room 2')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/10 messages • Created/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/5 messages • Created/)[0]).toBeInTheDocument();
  });

  it('calls handleCopyRoomUrl when copy URL button is clicked', () => {
    render(<ChatroomsList {...defaultProps} />);
    const copyUrlButtons = screen.getAllByTestId('copy-url-button');
    fireEvent.click(copyUrlButtons[0]);
    expect(defaultProps.handleCopyRoomUrl).toHaveBeenCalledWith(mockChatrooms[0]);
  });

  it('calls handleCopyRoomId when room code button is clicked', () => {
    render(<ChatroomsList {...defaultProps} />);
    const roomCodeButtons = screen.getAllByTestId('room-code-button');
    fireEvent.click(roomCodeButtons[0]);
    expect(defaultProps.handleCopyRoomId).toHaveBeenCalledWith(mockChatrooms[0]);
  });

  it('calls handleDeleteRoom when delete button is clicked', () => {
    render(<ChatroomsList {...defaultProps} />);
    const deleteButtons = screen.getAllByTestId('delete-room-button');
    fireEvent.click(deleteButtons[0]);
    expect(defaultProps.handleDeleteRoom).toHaveBeenCalledWith(mockChatrooms[0]);
  });

  it('uses roomUrl for link when available, otherwise uses id', () => {
    render(<ChatroomsList {...defaultProps} />);
    const links = screen.getAllByTestId('next-link');

    // There are 4 links total (2 for each room - mobile and desktop)
    // links[0] and links[1] are for the first room
    // links[2] and links[3] are for the second room

    // First room has roomUrl
    expect(links[0]).toHaveAttribute('href', '/test-room-1');

    // The second room doesn't have roomUrl, should use id
    expect(links[2]).toHaveAttribute('href', '/room2');
  });
});
