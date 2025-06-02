import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidRoomUrl } from '@/lib/roomUrl';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    // Try to find by roomUrl first, then by UUID as fallback
    let chatroom;
    if (isValidRoomUrl(roomId)) {
      chatroom = await prisma.chatroom.findUnique({
        where: { roomUrl: roomId },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });
    } else {
      // Fallback to UUID lookup for backward compatibility
      chatroom = await prisma.chatroom.findUnique({
        where: { id: roomId },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });
    }

    if (!chatroom) {
      return NextResponse.json({ error: 'Chatroom not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: chatroom.id,
      roomUrl: chatroom.roomUrl,
      title: chatroom.title,
      createdAt: chatroom.createdAt,
      messageCount: chatroom._count.messages,
      userId: chatroom.userId,
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
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { roomId } = await params;

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find chatroom by roomUrl or UUID and ensure it belongs to the user
    let chatroom;
    if (isValidRoomUrl(roomId)) {
      chatroom = await prisma.chatroom.findUnique({
        where: { 
          roomUrl: roomId,
        }
      });
    } else {
      chatroom = await prisma.chatroom.findUnique({
        where: { 
          id: roomId,
        }
      });
    }

    if (!chatroom) {
      return NextResponse.json(
        { error: 'Chatroom not found' },
        { status: 404 }
      );
    }

    // Check if the chatroom belongs to the authenticated user
    if (chatroom.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own chatrooms' },
        { status: 403 }
      );
    }

    // Delete all messages first (cascade delete)
    await prisma.message.deleteMany({
      where: {
        chatroomId: chatroom.id,
      },
    });

    // Then delete the chatroom
    await prisma.chatroom.delete({
      where: {
        id: chatroom.id,
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