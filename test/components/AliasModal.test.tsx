import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AliasModal from '@/components/AliasModal';
import * as aliasStorage from '@/lib/aliasStorage';

// Mock the aliasStorage module
jest.mock('../../src/lib/aliasStorage', () => ({
  saveAlias: jest.fn(),
}));

describe('AliasModal', () => {
  const mockOnAliasSet = jest.fn();
  const mockRoomId = 'room123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={true}
        roomId={mockRoomId}
      />
    );

    expect(screen.getByText('Join Chat Room')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter your name to join the chat:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join Chat/i })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={false}
        roomId={mockRoomId}
      />
    );

    expect(screen.queryByText('Join Chat Room')).not.toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={true}
        roomId={mockRoomId}
      />
    );

    const button = screen.getByRole('button', { name: /Join Chat/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when input has value', () => {
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={true}
        roomId={mockRoomId}
      />
    );

    const input = screen.getByLabelText(/Enter your name to join the chat:/i);
    fireEvent.change(input, { target: { value: 'TestUser' } });

    const button = screen.getByRole('button', { name: /Join Chat/i });
    expect(button).not.toBeDisabled();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Error message';
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={true}
        roomId={mockRoomId}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onAliasSet and saveAlias when form is submitted with valid input', () => {
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={true}
        roomId={mockRoomId}
      />
    );

    const input = screen.getByLabelText(/Enter your name to join the chat:/i);
    fireEvent.change(input, { target: { value: 'TestUser' } });

    const button = screen.getByRole('button', { name: /Join Chat/i });
    fireEvent.click(button);

    expect(aliasStorage.saveAlias).toHaveBeenCalledWith(mockRoomId, 'TestUser');
    expect(mockOnAliasSet).toHaveBeenCalledWith('TestUser');
  });

  it('trims whitespace from alias before saving and submitting', () => {
    render(
      <AliasModal
        onAliasSet={mockOnAliasSet}
        isOpen={true}
        roomId={mockRoomId}
      />
    );

    const input = screen.getByLabelText(/Enter your name to join the chat:/i);
    fireEvent.change(input, { target: { value: '  TestUser  ' } });

    const button = screen.getByRole('button', { name: /Join Chat/i });
    fireEvent.click(button);

    expect(aliasStorage.saveAlias).toHaveBeenCalledWith(mockRoomId, 'TestUser');
    expect(mockOnAliasSet).toHaveBeenCalledWith('TestUser');
  });
});
