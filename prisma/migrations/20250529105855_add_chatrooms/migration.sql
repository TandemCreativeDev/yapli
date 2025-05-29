/*
  Warnings:

  - Added the required column `chatroomId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "chatrooms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatrooms_pkey" PRIMARY KEY ("id")
);

-- Create a default global chatroom for existing messages
INSERT INTO "chatrooms" ("id", "title", "createdAt") 
VALUES ('global-chat', 'Global Chat', CURRENT_TIMESTAMP);

-- AlterTable - Add column with default value first, then remove default
ALTER TABLE "messages" ADD COLUMN "chatroomId" TEXT NOT NULL DEFAULT 'global-chat';

-- Remove the default value now that all rows have a value
ALTER TABLE "messages" ALTER COLUMN "chatroomId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
