import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRoomUrl } from '@/lib/roomUrl';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in GET /api/rooms:", session);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Only return chatrooms that belong to this user
    const chatrooms = await prisma.chatroom.findMany({
      where: {
        userId: user.id,
      },
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title } = await request.json();

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

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

    // Generate a unique room URL with collision handling
    let roomUrl: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      roomUrl = generateRoomUrl();
      attempts++;
      
      const existingRoom = await prisma.chatroom.findUnique({
        where: { roomUrl }
      });
      
      if (!existingRoom) break;
      
      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique room URL' },
          { status: 500 }
        );
      }
    } while (true);

    const chatroom = await prisma.chatroom.create({
      data: {
        title: title.trim(),
        roomUrl,
        userId: user.id,
      },
    });

    return NextResponse.json({ 
      roomUrl: chatroom.roomUrl, 
      title: chatroom.title 
    });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    return NextResponse.json(
      { error: 'Failed to create chatroom' },
      { status: 500 }
    );
  }
}