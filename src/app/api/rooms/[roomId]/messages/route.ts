import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } },
) {
  try {
    const { roomId } = params;

    // Check if the chatroom exists
    const chatroom = await prisma.chatroom.findUnique({
      where: { id: roomId },
    });

    if (!chatroom) {
      return NextResponse.json(
        { error: "Chatroom not found" },
        { status: 404 },
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        chatroomId: roomId,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } },
) {
  try {
    const { roomId } = params;
    const { alias, message } = await request.json();

    if (!alias || !message) {
      return NextResponse.json(
        { error: "Alias and message are required" },
        { status: 400 },
      );
    }

    // Check if the chatroom exists
    const chatroom = await prisma.chatroom.findUnique({
      where: { id: roomId },
    });

    if (!chatroom) {
      return NextResponse.json(
        { error: "Chatroom not found" },
        { status: 404 },
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        chatroomId: roomId,
        alias,
        message,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 },
    );
  }
}

