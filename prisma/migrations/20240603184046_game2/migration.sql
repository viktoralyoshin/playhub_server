/*
  Warnings:

  - You are about to drop the `Platform` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Platform" DROP CONSTRAINT "Platform_gameId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "platform" TEXT;

-- DropTable
DROP TABLE "Platform";
