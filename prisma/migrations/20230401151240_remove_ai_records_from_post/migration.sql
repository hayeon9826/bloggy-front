/*
  Warnings:

  - You are about to drop the column `postId` on the `AiRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AiRecord" DROP CONSTRAINT "AiRecord_postId_fkey";

-- DropIndex
DROP INDEX "AiRecord_postId_idx";

-- AlterTable
ALTER TABLE "AiRecord" DROP COLUMN "postId";

-- CreateIndex
CREATE INDEX "AiRecord_userId_idx" ON "AiRecord"("userId");
