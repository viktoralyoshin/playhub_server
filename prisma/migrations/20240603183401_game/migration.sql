-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "genre" TEXT;

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "gameId" TEXT,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Platform" ADD CONSTRAINT "Platform_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
