-- CreateTable
CREATE TABLE "AiRecord" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT,
    "userId" TEXT,

    CONSTRAINT "AiRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiRecord_postId_idx" ON "AiRecord"("postId");

-- AddForeignKey
ALTER TABLE "AiRecord" ADD CONSTRAINT "AiRecord_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecord" ADD CONSTRAINT "AiRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
