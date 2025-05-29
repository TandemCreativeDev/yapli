import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    const chatroom = await prisma.chatroom.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    if (!chatroom) {
      return NextResponse.json({ error: 'Chatroom not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: chatroom.id,
      title: chatroom.title,
      createdAt: chatroom.createdAt,
      messageCount: chatroom._count.messages,
    });
  } catch (error) {
    console.error('Error fetching chatroom:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatroom' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    // Check if chatroom exists
    const chatroom = await prisma.chatroom.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!chatroom) {
      return NextResponse.json(
        { error: 'Chatroom not found' },
        { status: 404 }
      );
    }

    // Delete all messages first (cascade delete)
    await prisma.message.deleteMany({
      where: {
        chatroomId: roomId,
      },
    });

    // Then delete the chatroom
    await prisma.chatroom.delete({
      where: {
        id: roomId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chatroom:', error);
    return NextResponse.json(
      { error: 'Failed to delete chatroom' },
      { status: 500 }
    );
  }
}