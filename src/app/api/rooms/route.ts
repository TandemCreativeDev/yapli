import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const chatrooms = await prisma.chatroom.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return NextResponse.json(chatrooms);
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatrooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const chatroom = await prisma.chatroom.create({
      data: {
        title: title.trim(),
      },
    });

    return NextResponse.json({ roomId: chatroom.id, title: chatroom.title });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    return NextResponse.json(
      { error: 'Failed to create chatroom' },
      { status: 500 }
    );
  }
}