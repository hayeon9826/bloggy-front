/*
  Warnings:

  - You are about to drop the column `chatType` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "chatType";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatType" "ChatType" NOT NULL DEFAULT 'USER';
