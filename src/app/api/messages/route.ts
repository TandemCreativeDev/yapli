import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Server as SocketIOServer } from 'socket.io'

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        timestamp: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alias, message } = body

    if (!alias || !message) {
      return NextResponse.json(
        { error: 'Alias and message are required' },
        { status: 400 }
      )
    }

    if (alias.length > 50) {
      return NextResponse.json(
        { error: 'Alias must be 50 characters or less' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be 1000 characters or less' },
        { status: 400 }
      )
    }

    const newMessage = await prisma.message.create({
      data: {
        alias: alias.trim(),
        message: message.trim()
      }
    })

    // Broadcast the message via Socket.io if available
    const io: SocketIOServer = (global as any).io
    if (io) {
      io.to('global-chat').emit('new-message', newMessage)
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}