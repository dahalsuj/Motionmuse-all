/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BrandKit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BrandKit" DROP CONSTRAINT "BrandKit_teamId_fkey";

-- AlterTable
ALTER TABLE "BrandKit" ADD COLUMN     "audio" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "teamId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BrandKit_userId_key" ON "BrandKit"("userId");

-- AddForeignKey
ALTER TABLE "BrandKit" ADD CONSTRAINT "BrandKit_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandKit" ADD CONSTRAINT "BrandKit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
