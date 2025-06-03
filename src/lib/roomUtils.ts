import { copyToClipboard } from './clipboard';

interface Chatroom {
  id: string;
  roomUrl?: string;
  title: string;
  createdAt: string;
  _count: {
    messages: number;
  };
}

export const copyRoomUrl = async (room: Chatroom): Promise<boolean> => {
  const url = `https://yapli.chat/${room.roomUrl || room.id}`;
  return copyToClipboard(url);
};

export const copyRoomId = async (room: Chatroom): Promise<boolean> => {
  return copyToClipboard(room.roomUrl || room.id);
};