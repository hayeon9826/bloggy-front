-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('USER', 'AI');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "chatType" "ChatType" NOT NULL DEFAULT 'USER';
