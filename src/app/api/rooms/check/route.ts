import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidRoomUrl } from '@/lib/roomUrl';

export async function POST(request: NextRequest) {
  try {
    const { roomUrl } = await request.json();

    if (!roomUrl || typeof roomUrl !== 'string') {
      return NextResponse.json(
        { error: 'Room URL is required' },
        { status: 400 }
      );
    }

    const cleanRoomUrl = roomUrl.toLowerCase().trim();

    if (!isValidRoomUrl(cleanRoomUrl)) {
      return NextResponse.json(
        { exists: false, error: 'Invalid room URL format' },
        { status: 400 }
      );
    }

    const chatroom = await prisma.chatroom.findUnique({
      where: { roomUrl: cleanRoomUrl },
      select: { id: true, roomUrl: true }
    });

    return NextResponse.json({
      exists: !!chatroom,
      roomUrl: chatroom?.roomUrl
    });
  } catch (error) {
    console.error('Error checking room:', error);
    return NextResponse.json(
      { error: 'Failed to check room' },
      { status: 500 }
    );
  }
}