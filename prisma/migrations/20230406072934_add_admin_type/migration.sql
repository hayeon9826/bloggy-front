-- CreateEnum
CREATE TYPE "AdminType" AS ENUM ('NONE', 'NORMAL', 'SUPER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminType" "AdminType" NOT NULL DEFAULT 'NONE';
